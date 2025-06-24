import os
import logging
import time
import json
import re
from typing import Dict, Any, List
from groq import Groq
from langchain_groq import ChatGroq
from langchain_community.tools import DuckDuckGoSearchRun
from langchain.agents import initialize_agent, AgentType
from langchain.prompts import PromptTemplate
from langchain.schema import HumanMessage
import asyncio
from playwright.async_api import async_playwright

logger = logging.getLogger(__name__)

class CompanyResearcher:
    """Service for researching company information using GROQ and web search."""
    
    def __init__(self):
        self.groq_api_key = os.getenv('GROQ_API_KEY')
        if not self.groq_api_key:
            raise ValueError("GROQ_API_KEY environment variable is required")
        
        # Initialize GROQ client for web search
        self.groq_client = Groq(api_key=self.groq_api_key)
        
        # Initialize GROQ LLM for text processing
        self.llm = ChatGroq(
            groq_api_key=self.groq_api_key,
            model_name="llama3-8b-8192",
            temperature=0.1
        )
        
        # Initialize web search tool (commented out - using GROQ compound-beta instead)
        # self.search_tool = DuckDuckGoSearchRun()
        
        # Initialize agent (commented out - using direct GROQ search instead)
        # self.agent = initialize_agent(
        #     tools=[self.search_tool],
        #     llm=self.llm,
        #     agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
        #     verbose=True,
        #     handle_parsing_errors=True
        # )
        
        # Create a comprehensive prompt template
        self.prompt_template = PromptTemplate(
            input_variables=["company_name", "company_location"],
            template="""
You are a professional business researcher. Please provide comprehensive information about {company_name}, a company based in {company_location}.

Use web search to gather the most current and accurate information about:

1. **Company Overview**: What does the company do? What is their main business model?
2. **Founders & Leadership**: Who founded the company? Who are the current key executives?
3. **Company History**: When was it founded? What's the story behind its creation?
4. **Funding Information**: What funding rounds have they had? Total funding raised? Investors?
5. **Company Size**: Number of employees, offices, global presence
6. **Demographics**: Employee diversity, age distribution, gender distribution if available
7. **Recent News**: Any recent developments, partnerships, acquisitions, or significant events
8. **Technology/Products**: What technologies do they use? What are their main products/services?
9. **Market Position**: Competitors, market share, industry position
10. **Culture & Values**: Company culture, values, mission statement

Please structure your response in a clear, organized format with sections. Be specific and include relevant numbers, dates, and facts. If information is not available for any section, clearly state that.

Search for the most recent and reliable information about this company.
"""
        )
    
    def _extract_urls_from_text(self, text: str) -> List[str]:
        """Extract URLs from text using regex."""
        url_pattern = r'https?://(?:[-\w.])+(?:[:\d]+)?(?:/(?:[\w/_.])*(?:\?(?:[\w&=%.])*)?(?:#(?:[\w.])*)?)?'
        urls = re.findall(url_pattern, text)
        return list(set(urls))  # Remove duplicates
    
    def _groq_web_search(self, query: str) -> Dict[str, Any]:
        """
        Perform web search using GROQ's compound-beta model and extract URLs.
        """
        try:
            logger.info(f"Using GROQ compound-beta for web search: {query}")
            
            completion = self.groq_client.chat.completions.create(
                messages=[
                    {
                        "role": "user",
                        "content": f"Search the web for: {query}. Please include relevant URLs in your response.",
                    }
                ],
                model="compound-beta",
            )
            
            result = completion.choices[0].message.content
            urls = self._extract_urls_from_text(result)
            
            logger.info("GROQ web search completed successfully")
            return {
                "content": result,
                "urls": urls
            }
            
        except Exception as e:
            logger.warning(f"GROQ web search failed: {str(e)}")
            return {
                "content": f"Unable to perform GROQ web search for: {query}",
                "urls": []
            }
    
    async def _playwright_search(self, query: str) -> Dict[str, Any]:
        """
        Perform Google search using Playwright for fallback and extract URLs.
        """
        try:
            async with async_playwright() as p:
                # Launch browser
                browser = await p.chromium.launch(headless=True)
                page = await browser.new_page()
                
                # Set user agent to avoid detection
                await page.set_extra_http_headers({
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                })
                
                # Navigate to Google search
                search_url = f"https://www.google.com/search?q={query.replace(' ', '+')}"
                await page.goto(search_url, wait_until='networkidle')
                
                # Wait for search results to load
                await page.wait_for_selector('div[id="search"]', timeout=10000)
                
                # Extract search results and URLs
                search_results = []
                urls = []
                
                # Extract URLs from search results
                try:
                    link_elements = await page.query_selector_all('a[href^="http"]')
                    for element in link_elements[:10]:  # Get first 10 links
                        href = await element.get_attribute('href')
                        if href and 'google.com' not in href:
                            urls.append(href)
                except Exception as e:
                    logger.debug(f"URL extraction failed: {str(e)}")
                
                # Try multiple selectors for different Google layouts
                selectors = [
                    'div[data-sokoban-container] div[data-ved] div[data-content-feature="1"]',
                    'div.g div[data-hveid]',
                    'div[jscontroller] div[data-ved]',
                    'div[data-ved] div[data-content-feature="1"]',
                    'div.g div[data-hveid] div[data-content-feature="1"]'
                ]
                
                for selector in selectors:
                    try:
                        elements = await page.query_selector_all(selector)
                        if elements:
                            for element in elements[:5]:  # Get first 5 results
                                text = await element.inner_text()
                                if text.strip() and len(text.strip()) > 50:
                                    search_results.append(text.strip())
                            break
                    except Exception as e:
                        logger.debug(f"Selector {selector} failed: {str(e)}")
                        continue
                
                # If no results found with specific selectors, try a broader approach
                if not search_results:
                    try:
                        # Get all text content from the main search area
                        main_content = await page.query_selector('#search')
                        if main_content:
                            text = await main_content.inner_text()
                            # Split by lines and filter meaningful content
                            lines = [line.strip() for line in text.split('\n') if len(line.strip()) > 30]
                            search_results = lines[:10]  # Get first 10 meaningful lines
                    except Exception as e:
                        logger.debug(f"Broad search approach failed: {str(e)}")
                
                await browser.close()
                
                if search_results:
                    return {
                        "content": " ".join(search_results),
                        "urls": list(set(urls))  # Remove duplicates
                    }
                else:
                    return {
                        "content": f"Unable to extract search results for: {query}",
                        "urls": []
                    }
                    
        except Exception as e:
            logger.warning(f"Playwright search failed: {str(e)}")
            return {
                "content": f"Unable to perform web search for: {query}",
                "urls": []
            }
    
    def _search_with_fallback(self, query: str) -> Dict[str, Any]:
        """
        Search with GROQ as primary method, Playwright as fallback.
        """
        # Try GROQ web search first
        groq_result = self._groq_web_search(query)
        
        # If GROQ search fails or returns error message, use Playwright fallback
        if groq_result["content"].startswith("Unable to perform GROQ web search"):
            logger.info("GROQ search failed, using Playwright fallback")
            try:
                # Run the async Playwright search
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
                playwright_result = loop.run_until_complete(self._playwright_search(query))
                loop.close()
                return playwright_result
            except Exception as e:
                logger.warning(f"Playwright fallback also failed: {str(e)}")
                return {
                    "content": f"Unable to perform web search for: {query}",
                    "urls": []
                }
        
        return groq_result
    
    def research_company(self, company_name: str, company_location: str) -> Dict[str, Any]:
        """
        Research a company using web search and LLM analysis, returning structured JSON.
        
        Args:
            company_name: Name of the company
            company_location: Location of the company
            
        Returns:
            Dictionary containing structured research results with sections and links
        """
        try:
            logger.info(f"Starting comprehensive research for {company_name} in {company_location}")
            
            # Search for company information using GROQ with Playwright fallback
            search_query = f"{company_name} {company_location} company founders funding employees history technology products market position culture values recent news"
            search_results = self._search_with_fallback(search_query)
            
            # Create the comprehensive research prompt asking for JSON output
            prompt = f"""
You are a professional business researcher. Based on the following search results, provide comprehensive information about {company_name}, a company based in {company_location}.

Search Results:
{search_results["content"]}

Please provide a detailed analysis in the following JSON format. Include specific facts, numbers, dates, and names where available. If information is not available for any section, use "Information not available" as the content.

Return ONLY valid JSON with this exact structure:

{{
  "company_overview": {{
    "content": "Detailed description of what the company does, their main business model, and core activities",
    "sources": ["url1", "url2"]
  }},
  "founders_leadership": {{
    "content": "Information about founders, current CEO, key executives, and leadership team",
    "sources": ["url1", "url2"]
  }},
  "company_history": {{
    "content": "When the company was founded, founding story, key milestones, and historical developments",
    "sources": ["url1", "url2"]
  }},
  "funding_information": {{
    "content": "Funding rounds, total capital raised, major investors, and funding history",
    "sources": ["url1", "url2"]
  }},
  "company_size": {{
    "content": "Number of employees, offices, global presence, and company scale",
    "sources": ["url1", "url2"]
  }},
  "demographics": {{
    "content": "Employee diversity, age distribution, gender distribution, and workforce statistics",
    "sources": ["url1", "url2"]
  }},
  "recent_news": {{
    "content": "Recent developments, partnerships, acquisitions, and significant events",
    "sources": ["url1", "url2"]
  }},
  "technology_products": {{
    "content": "Technology stack, main products/services, and technical capabilities",
    "sources": ["url1", "url2"]
  }},
  "market_position": {{
    "content": "Competitors, market share, industry position, and competitive landscape",
    "sources": ["url1", "url2"]
  }},
  "culture_values": {{
    "content": "Company culture, values, mission statement, and workplace environment",
    "sources": ["url1", "url2"]
  }}
}}

Important:
1. Extract URLs from the search results and include them in the sources arrays
2. Provide detailed, factual content for each section
3. If information is not available, use "Information not available" as content
4. Ensure the response is valid JSON that can be parsed
5. Include all URLs found in the search results in the appropriate sources arrays
"""
            
            # Get response from LLM
            messages = [HumanMessage(content=prompt)]
            response = self.llm.invoke(messages)
            
            # Try to parse the JSON response
            try:
                # Clean the response to extract JSON
                response_text = response.content.strip()
                
                # Find JSON content (remove any markdown formatting)
                if response_text.startswith("```json"):
                    response_text = response_text[7:]
                if response_text.endswith("```"):
                    response_text = response_text[:-3]
                
                response_text = response_text.strip()
                
                # Parse the JSON
                structured_data = json.loads(response_text)
                
                # Extract all URLs from search results
                all_urls = search_results.get("urls", [])
                
                # Add URLs to sections if not already present
                for section_key, section_data in structured_data.items():
                    if isinstance(section_data, dict) and "sources" in section_data:
                        # Add any URLs from search results that aren't already in sources
                        existing_sources = section_data.get("sources", [])
                        if not existing_sources and all_urls:
                            section_data["sources"] = all_urls[:3]  # Limit to 3 URLs per section
                
                logger.info(f"Comprehensive research completed for {company_name}")
                
                return {
                    "status": "success",
                    "company_name": company_name,
                    "company_location": company_location,
                    "research_method": "GROQ compound-beta with Playwright fallback",
                    "last_updated": time.strftime("%Y-%m-%d %H:%M:%S"),
                    "sections": structured_data,
                    "all_sources": all_urls,
                    "summary": {
                        "total_sections": len(structured_data),
                        "sections_with_data": sum(1 for section in structured_data.values() 
                                                if isinstance(section, dict) and 
                                                section.get("content") and 
                                                not section.get("content", "").startswith("Information not available")),
                        "total_sources": len(all_urls)
                    }
                }
                
            except json.JSONDecodeError as e:
                logger.warning(f"Failed to parse JSON response: {str(e)}")
                # Fallback to markdown format
                return {
                    "status": "success",
                    "company_name": company_name,
                    "company_location": company_location,
                    "research_results": response.content,
                    "search_results_used": True,
                    "research_method": "GROQ compound-beta with Playwright fallback",
                    "search_results": search_results["content"],
                    "urls": search_results.get("urls", [])
                }
            
        except Exception as e:
            logger.error(f"Error researching company {company_name}: {str(e)}")
            return {
                "status": "error",
                "company_name": company_name,
                "company_location": company_location,
                "error": str(e),
                "research_method": "GROQ compound-beta with Playwright fallback",
                "search_results": None,
                "urls": []
            }
    
    def get_quick_company_info(self, company_name: str, company_location: str) -> Dict[str, Any]:
        """
        Get quick company information using direct LLM call with search results.
        
        Args:
            company_name: Name of the company
            company_location: Location of the company
            
        Returns:
            Dictionary containing company information
        """
        try:
            logger.info(f"Getting quick info for {company_name} in {company_location}")
            
            # Search for company information using GROQ with Playwright fallback
            search_query = f"{company_name} {company_location} company founders funding employees"
            search_results = self._search_with_fallback(search_query)
            
            # Create prompt with search results
            prompt = f"""
Based on the following search results, provide comprehensive information about {company_name}, a company based in {company_location}.

Search Results:
{search_results["content"]}

Please provide detailed information about:
1. Company overview and business model
2. Founders and leadership team
3. Company history and founding story
4. Funding information and investors
5. Company size and employee count
6. Recent developments and news
7. Technology stack and products/services
8. Market position and competitors

Structure your response clearly with sections. If any information is not available in the search results, clearly state that.
"""
            
            # Get response from LLM
            messages = [HumanMessage(content=prompt)]
            response = self.llm.invoke(messages)
            
            logger.info(f"Quick info completed for {company_name}")
            
            return {
                "status": "success",
                "company_name": company_name,
                "company_location": company_location,
                "information": response.content,
                "search_results_used": True,
                "research_method": "GROQ compound-beta with Playwright fallback",
                "search_results": search_results["content"],
                "urls": search_results["urls"]
            }
            
        except Exception as e:
            logger.error(f"Error getting quick info for {company_name}: {str(e)}")
            return {
                "status": "error",
                "company_name": company_name,
                "company_location": company_location,
                "error": str(e),
                "research_method": "GROQ compound-beta with Playwright fallback",
                "search_results": None,
                "urls": []
            }
    
    def research_company_structured(self, company_name: str, company_location: str) -> Dict[str, Any]:
        """
        Research a company and return structured JSON format with source links.
        
        Args:
            company_name: Name of the company
            company_location: Location of the company
            
        Returns:
            Dictionary containing structured research results with sections and links
        """
        try:
            logger.info(f"Starting structured research for {company_name} in {company_location}")
            
            # Define the sections we want to research
            sections = [
                {
                    "key": "company_overview",
                    "title": "Company Overview",
                    "search_queries": [
                        f"{company_name} {company_location} company overview business model",
                        f"{company_name} what does company do business description"
                    ]
                },
                {
                    "key": "founders_leadership",
                    "title": "Founders & Leadership",
                    "search_queries": [
                        f"{company_name} founders CEO executives leadership team",
                        f"{company_name} who founded company key executives"
                    ]
                },
                {
                    "key": "company_history",
                    "title": "Company History",
                    "search_queries": [
                        f"{company_name} founded history timeline story",
                        f"{company_name} when founded company creation story"
                    ]
                },
                {
                    "key": "funding_information",
                    "title": "Funding & Investors",
                    "search_queries": [
                        f"{company_name} funding rounds investors capital raised",
                        f"{company_name} venture capital funding history"
                    ]
                },
                {
                    "key": "company_size",
                    "title": "Company Size",
                    "search_queries": [
                        f"{company_name} employees headcount company size offices",
                        f"{company_name} number of employees global presence"
                    ]
                },
                {
                    "key": "demographics",
                    "title": "Demographics",
                    "search_queries": [
                        f"{company_name} employee diversity demographics gender age",
                        f"{company_name} workforce diversity statistics"
                    ]
                },
                {
                    "key": "recent_news",
                    "title": "Recent Developments",
                    "search_queries": [
                        f"{company_name} recent news developments 2024 2023",
                        f"{company_name} latest news partnerships acquisitions"
                    ]
                },
                {
                    "key": "technology_products",
                    "title": "Technology & Products",
                    "search_queries": [
                        f"{company_name} technology stack products services",
                        f"{company_name} tech stack main products offerings"
                    ]
                },
                {
                    "key": "market_position",
                    "title": "Market Position",
                    "search_queries": [
                        f"{company_name} competitors market share industry position",
                        f"{company_name} market position competitors analysis"
                    ]
                },
                {
                    "key": "culture_values",
                    "title": "Culture & Values",
                    "search_queries": [
                        f"{company_name} company culture values mission statement",
                        f"{company_name} workplace culture employee values"
                    ]
                }
            ]
            
            # Research each section
            structured_data = {
                "company_overview": {"content": "", "sources": []},
                "founders_leadership": {"content": "", "sources": []},
                "company_history": {"content": "", "sources": []},
                "funding_information": {"content": "", "sources": []},
                "company_size": {"content": "", "sources": []},
                "demographics": {"content": "", "sources": []},
                "recent_news": {"content": "", "sources": []},
                "technology_products": {"content": "", "sources": []},
                "market_position": {"content": "", "sources": []},
                "culture_values": {"content": "", "sources": []}
            }
            
            all_urls = []
            
            for section in sections:
                logger.info(f"Researching section: {section['title']}")
                
                # Search for each query in the section
                section_content = []
                section_urls = []
                
                for query in section["search_queries"]:
                    search_result = self._search_with_fallback(query)
                    if search_result["content"] and not search_result["content"].startswith("Unable to perform"):
                        section_content.append(search_result["content"])
                        section_urls.extend(search_result["urls"])
                
                # Combine content and create summary
                if section_content:
                    combined_content = " ".join(section_content)
                    
                    # Create a focused prompt for this section
                    section_prompt = f"""
Based on the following search results about {company_name}, provide a comprehensive summary for the {section['title']} section.

Search Results:
{combined_content}

Please provide:
1. A detailed summary of the {section['title'].lower()} information
2. Include specific facts, numbers, dates, and names where available
3. If information is not available, clearly state that
4. Focus only on information relevant to {section['title']}

Format your response in clear paragraphs with proper structure.
"""
                    
                    # Get LLM response for this section
                    messages = [HumanMessage(content=section_prompt)]
                    response = self.llm.invoke(messages)
                    
                    structured_data[section["key"]]["content"] = response.content
                    structured_data[section["key"]]["sources"] = list(set(section_urls))  # Remove duplicates
                    all_urls.extend(section_urls)
                else:
                    structured_data[section["key"]]["content"] = f"No information available for {section['title']}."
                    structured_data[section["key"]]["sources"] = []
            
            # Create final structured response
            result = {
                "status": "success",
                "company_name": company_name,
                "company_location": company_location,
                "research_method": "Structured GROQ compound-beta with Playwright fallback",
                "last_updated": time.strftime("%Y-%m-%d %H:%M:%S"),
                "sections": structured_data,
                "all_sources": list(set(all_urls)),  # Remove duplicates
                "summary": {
                    "total_sections": len(sections),
                    "sections_with_data": sum(1 for section in structured_data.values() if section["content"] and not section["content"].startswith("No information")),
                    "total_sources": len(set(all_urls))
                }
            }
            
            logger.info(f"Structured research completed for {company_name}")
            return result
            
        except Exception as e:
            logger.error(f"Error in structured research for {company_name}: {str(e)}")
            return {
                "status": "error",
                "company_name": company_name,
                "company_location": company_location,
                "error": str(e),
                "research_method": "Structured GROQ compound-beta with Playwright fallback",
                "sections": {},
                "all_sources": [],
                "summary": {
                    "total_sections": 0,
                    "sections_with_data": 0,
                    "total_sources": 0
                }
            } 