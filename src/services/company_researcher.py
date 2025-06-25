import logging
import time
from typing import Dict, Any
from .search.search_manager import SearchManager
from .research.llm_processor import LLMProcessor
from .research.structured_researcher import StructuredResearcher

logger = logging.getLogger(__name__)

class CompanyResearcher:
    """Main service for researching company information using modular components."""
    
    def __init__(self, llm_provider: str = "groq"):
        """
        Initialize company researcher with specified LLM provider.
        Search provider is automatically determined based on LLM provider.
        
        Args:
            llm_provider: LLM provider for text processing ("groq" or "gemini")
        """
        # Determine search provider based on LLM provider
        search_provider = llm_provider  # Use same provider for search and LLM
        
        self.search_manager = SearchManager(primary_provider=search_provider)
        self.llm_processor = LLMProcessor(provider=llm_provider)
        self.structured_researcher = StructuredResearcher(search_provider, llm_provider)
        
        logger.info(f"Initialized CompanyResearcher with llm_provider={llm_provider}, auto-selected search_provider={search_provider}")
    
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
            
            # Search for company information using configured provider with fallback
            search_query = f"{company_name} {company_location} company founders funding employees history technology products market position culture values recent news"
            search_results = self.search_manager.search_with_fallback(search_query)
            
            # Process the search results with LLM
            llm_result = self.llm_processor.process_comprehensive_research(
                company_name, company_location, search_results
            )
            
            if llm_result["status"] == "success":
                logger.info(f"Comprehensive research completed for {company_name}")
                
                return {
                    "status": "success",
                    "company_name": company_name,
                    "company_location": company_location,
                    "research_method": f"{self.llm_processor.provider.upper()} LLM with {self.search_manager.primary_provider.upper()} search and Playwright fallback",
                    "last_updated": time.strftime("%Y-%m-%d %H:%M:%S"),
                    "sections": llm_result["structured_data"],
                    "all_sources": llm_result["all_urls"],
                    "summary": {
                        "total_sections": len(llm_result["structured_data"]),
                        "sections_with_data": sum(1 for section in llm_result["structured_data"].values() 
                                                if isinstance(section, dict) and 
                                                section.get("content") and 
                                                not section.get("content", "").startswith("Information not available")),
                        "total_sources": len(llm_result["all_urls"])
                    }
                }
            else:
                # Fallback to markdown format
                return {
                    "status": "success",
                    "company_name": company_name,
                    "company_location": company_location,
                    "research_results": llm_result["raw_response"],
                    "search_results_used": True,
                    "research_method": f"{self.llm_processor.provider.upper()} LLM with {self.search_manager.primary_provider.upper()} search and Playwright fallback",
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
                "research_method": f"{self.llm_processor.provider.upper()} LLM with {self.search_manager.primary_provider.upper()} search and Playwright fallback",
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
            
            # Search for company information using configured provider with fallback
            search_query = f"{company_name} {company_location} company founders funding employees"
            search_results = self.search_manager.search_with_fallback(search_query)
            
            # Process the search results with LLM
            information = self.llm_processor.process_quick_research(
                company_name, company_location, search_results
            )
            
            logger.info(f"Quick info completed for {company_name}")
            
            return {
                "status": "success",
                "company_name": company_name,
                "company_location": company_location,
                "information": information,
                "search_results_used": True,
                "research_method": f"{self.llm_processor.provider.upper()} LLM with {self.search_manager.primary_provider.upper()} search and Playwright fallback",
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
                "research_method": f"{self.llm_processor.provider.upper()} LLM with {self.search_manager.primary_provider.upper()} search and Playwright fallback",
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
        return self.structured_researcher.research_company_structured(company_name, company_location)
    
    def get_available_providers(self) -> Dict[str, list]:
        """
        Get list of available providers for LLM processing.
        
        Returns:
            Dictionary with available LLM providers
        """
        return {
            "llm_providers": ["groq", "gemini"],
            "research_types": ["quick", "comprehensive", "structured"]
        } 