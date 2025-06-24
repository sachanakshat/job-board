import os
import logging
from typing import Dict, Any
from groq import Groq
from ..utils.url_extractor import extract_urls_from_text

logger = logging.getLogger(__name__)

class GroqSearch:
    """Service for performing web searches using GROQ's compound-beta model."""
    
    def __init__(self):
        self.groq_api_key = os.getenv('GROQ_API_KEY')
        if not self.groq_api_key:
            raise ValueError("GROQ_API_KEY environment variable is required")
        
        # Initialize GROQ client for web search
        self.groq_client = Groq(api_key=self.groq_api_key)
    
    def search(self, query: str) -> Dict[str, Any]:
        """
        Perform web search using GROQ's compound-beta model and extract URLs.
        
        Args:
            query: Search query string
            
        Returns:
            Dictionary containing search results and extracted URLs
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
            urls = extract_urls_from_text(result)
            
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