import os
import logging
import time
from typing import Dict, Any
from langchain_groq import ChatGroq
from langchain_community.tools import DuckDuckGoSearchRun
from langchain.agents import initialize_agent, AgentType
from langchain.prompts import PromptTemplate
from langchain.schema import HumanMessage
import asyncio
from playwright.async_api import async_playwright

logger = logging.getLogger(__name__)

class CompanyResearcher:
    """Service for researching company information using LangChain and web search."""
    
    def __init__(self):
        self.groq_api_key = os.getenv('GROQ_API_KEY')
        if not self.groq_api_key:
            raise ValueError("GROQ_API_KEY environment variable is required")
        
        # Initialize GROQ LLM
        self.llm = ChatGroq(
            groq_api_key=self.groq_api_key,
            model_name="llama3-8b-8192",
            temperature=0.1
        )
        
        # Initialize web search tool with retry mechanism
        self.search_tool = DuckDuckGoSearchRun()
        
        # Initialize agent
        self.agent = initialize_agent(
            tools=[self.search_tool],
            llm=self.llm,
            agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
            verbose=True,
            handle_parsing_errors=True
        )
        
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
    
    async def _playwright_search(self, query: str) -> str:
        """
        Perform Google search using Playwright for better reliability.
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
                
                # Extract search results
                search_results = []
                
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
                    return " ".join(search_results)
                else:
                    return f"Unable to extract search results for: {query}"
                    
        except Exception as e:
            logger.warning(f"Playwright search failed: {str(e)}")
            return f"Unable to perform web search for: {query}"
    
    def _fallback_search(self, query: str) -> str:
        """
        Fallback search method using Playwright for Google search.
        """
        try:
            # Run the async Playwright search
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            result = loop.run_until_complete(self._playwright_search(query))
            loop.close()
            return result
        except Exception as e:
            logger.warning(f"Fallback search failed: {str(e)}")
            return f"Unable to perform web search for: {query}"
    
    def _search_with_retry(self, query: str, max_retries: int = 3) -> str:
        """
        Search with retry mechanism to handle rate limits.
        """
        # Temporarily force fallback search for testing
        logger.info("Using Playwright fallback search for testing")
        return self._fallback_search(query)
        
        # Original code (commented out for testing):
        # for attempt in range(max_retries):
        #     try:
        #         result = self.search_tool.run(query)
        #         return result
        #     except Exception as e:
        #         if "Ratelimit" in str(e) and attempt < max_retries - 1:
        #             logger.warning(f"Rate limit hit, retrying in {2 ** attempt} seconds...")
        #             time.sleep(2 ** attempt)  # Exponential backoff
        #             continue
        #         else:
        #             logger.warning(f"Search failed, using fallback: {str(e)}")
        #             return self._fallback_search(query)
        # 
        # return self._fallback_search(query)
    
    def research_company(self, company_name: str, company_location: str) -> Dict[str, Any]:
        """
        Research a company using web search and LLM analysis.
        
        Args:
            company_name: Name of the company
            company_location: Location of the company
            
        Returns:
            Dictionary containing research results
        """
        try:
            logger.info(f"Starting research for {company_name} in {company_location}")
            
            # Create the research prompt
            prompt = self.prompt_template.format(
                company_name=company_name,
                company_location=company_location
            )
            
            # Execute the research using the agent
            result = self.agent.run(prompt)
            
            logger.info(f"Research completed for {company_name}")
            
            return {
                "status": "success",
                "company_name": company_name,
                "company_location": company_location,
                "research_results": result,
                "research_method": "LangChain with web search"
            }
            
        except Exception as e:
            logger.error(f"Error researching company {company_name}: {str(e)}")
            return {
                "status": "error",
                "company_name": company_name,
                "company_location": company_location,
                "error": str(e),
                "research_method": "LangChain with web search"
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
            
            # Search for company information with retry mechanism
            search_query = f"{company_name} {company_location} company founders funding employees"
            search_results = self._search_with_retry(search_query)
            
            # Create prompt with search results
            prompt = f"""
Based on the following search results, provide comprehensive information about {company_name}, a company based in {company_location}.

Search Results:
{search_results}

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
                "research_method": "LangChain with web search"
            }
            
        except Exception as e:
            logger.error(f"Error getting quick info for {company_name}: {str(e)}")
            return {
                "status": "error",
                "company_name": company_name,
                "company_location": company_location,
                "error": str(e),
                "research_method": "LangChain with web search"
            } 