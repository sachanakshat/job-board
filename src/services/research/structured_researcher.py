import logging
import time
from typing import Dict, Any
from ..search.search_manager import SearchManager
from .llm_processor import LLMProcessor

logger = logging.getLogger(__name__)

class StructuredResearcher:
    """Service for performing structured research with configurable providers."""
    
    def __init__(self, search_provider: str = "groq", llm_provider: str = "groq"):
        """
        Initialize structured researcher with specified providers.
        
        Args:
            search_provider: Primary search provider ("groq" or "gemini")
            llm_provider: LLM provider for text processing ("groq" or "gemini")
        """
        self.search_manager = SearchManager(primary_provider=search_provider)
        self.llm_processor = LLMProcessor(provider=llm_provider)
        
        logger.info(f"Initialized StructuredResearcher with search_provider={search_provider}, llm_provider={llm_provider}")
    
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
            
            # Define sections to research
            sections = [
                "Company Overview",
                "Founders & Leadership", 
                "Company History",
                "Funding & Investors",
                "Company Size",
                "Demographics",
                "Recent News",
                "Technology & Products",
                "Market Position",
                "Culture & Values"
            ]
            
            structured_data = {}
            all_urls = []
            
            # Research each section individually
            for section in sections:
                logger.info(f"Researching section: {section}")
                
                # Create search query for this section
                if section == "Company Overview":
                    search_query = f"{company_name} {company_location} company overview business model"
                elif section == "Founders & Leadership":
                    search_query = f"{company_name} founders CEO executives leadership team"
                elif section == "Company History":
                    search_query = f"{company_name} founded history timeline story"
                elif section == "Funding & Investors":
                    search_query = f"{company_name} funding rounds investors capital raised"
                elif section == "Company Size":
                    search_query = f"{company_name} employees headcount company size offices"
                elif section == "Demographics":
                    search_query = f"{company_name} employee demographics diversity workforce statistics"
                elif section == "Recent News":
                    search_query = f"{company_name} recent news developments partnerships acquisitions"
                elif section == "Technology & Products":
                    search_query = f"{company_name} technology stack products services tech capabilities"
                elif section == "Market Position":
                    search_query = f"{company_name} competitors market share industry position"
                elif section == "Culture & Values":
                    search_query = f"{company_name} company culture values mission statement workplace"
                else:
                    search_query = f"{company_name} {section.lower()}"
                
                # Search for information
                search_results = self.search_manager.search_with_fallback(search_query)
                
                # Process with LLM to get structured content
                llm_result = self.llm_processor.process_comprehensive_research(
                    company_name, company_location, search_results
                )
                
                # Extract section content and URLs
                if llm_result["status"] == "success":
                    # Find the relevant section in the structured data
                    section_key = section.lower().replace(" & ", "_").replace(" ", "_")
                    if section_key in llm_result["structured_data"]:
                        structured_data[section_key] = llm_result["structured_data"][section_key]
                    else:
                        # Fallback: create section with raw content
                        structured_data[section_key] = {
                            "content": f"Information about {section} for {company_name}",
                            "sources": search_results.get("urls", [])
                        }
                else:
                    # Fallback: use raw search results
                    structured_data[section.lower().replace(" & ", "_").replace(" ", "_")] = {
                        "content": search_results["content"],
                        "sources": search_results.get("urls", [])
                    }
                
                # Collect all URLs
                all_urls.extend(search_results.get("urls", []))
                
                # Add delay to avoid rate limiting
                time.sleep(1)
            
            # Remove duplicates from URLs
            all_urls = list(set(all_urls))
            
            logger.info(f"Structured research completed for {company_name}")
            
            return {
                "status": "success",
                "company_name": company_name,
                "company_location": company_location,
                "research_method": f"{self.llm_processor.provider.upper()} LLM with {self.search_manager.primary_provider.upper()} search and Playwright fallback",
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
            
        except Exception as e:
            logger.error(f"Error in structured research for {company_name}: {str(e)}")
            return {
                "status": "error",
                "company_name": company_name,
                "company_location": company_location,
                "error": str(e),
                "research_method": f"{self.llm_processor.provider.upper()} LLM with {self.search_manager.primary_provider.upper()} search and Playwright fallback"
            } 