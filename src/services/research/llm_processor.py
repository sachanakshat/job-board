import os
import logging
import json
from typing import Dict, Any
from langchain_groq import ChatGroq
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.schema import HumanMessage

logger = logging.getLogger(__name__)

class LLMProcessor:
    """Service for processing search results with LLM analysis using multiple providers."""
    
    def __init__(self, provider: str = "groq"):
        """
        Initialize LLM processor with specified provider.
        
        Args:
            provider: LLM provider ("groq" or "gemini")
        """
        self.provider = provider.lower()
        self.llm = None
        
        if self.provider == "groq":
            self._init_groq()
        elif self.provider == "gemini":
            self._init_gemini()
        else:
            logger.warning(f"Unknown provider {provider}, defaulting to GROQ")
            self._init_groq()
        
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
    
    def _init_groq(self):
        """Initialize GROQ LLM."""
        groq_api_key = os.getenv('GROQ_API_KEY')
        if not groq_api_key:
            raise ValueError("GROQ_API_KEY environment variable is required")
        
        self.llm = ChatGroq(
            groq_api_key=groq_api_key,
            model_name="meta-llama/llama-4-scout-17b-16e-instruct",
            temperature=0.1
        )
        logger.info("Initialized GROQ LLM processor")
    
    def _init_gemini(self):
        """Initialize Gemini LLM."""
        google_api_key = os.getenv('GOOGLE_API_KEY')
        if not google_api_key:
            raise ValueError("GOOGLE_API_KEY environment variable is required")
        
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            google_api_key=google_api_key,
            temperature=0.1
        )
        logger.info("Initialized Gemini LLM processor")
    
    def process_comprehensive_research(self, company_name: str, company_location: str, search_results: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process search results for comprehensive research with structured JSON output.
        
        Args:
            company_name: Name of the company
            company_location: Location of the company
            search_results: Search results from web search
            
        Returns:
            Dictionary containing structured research results
        """
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
            
            return {
                "status": "success",
                "structured_data": structured_data,
                "all_urls": all_urls,
                "raw_response": response.content
            }
            
        except json.JSONDecodeError as e:
            logger.warning(f"Failed to parse JSON response: {str(e)}")
            # Return fallback format
            return {
                "status": "fallback",
                "raw_response": response.content,
                "all_urls": search_results.get("urls", [])
            }
    
    def process_quick_research(self, company_name: str, company_location: str, search_results: Dict[str, Any]) -> str:
        """
        Process search results for quick research with markdown output.
        
        Args:
            company_name: Name of the company
            company_location: Location of the company
            search_results: Search results from web search
            
        Returns:
            Formatted markdown response
        """
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
        
        return response.content 