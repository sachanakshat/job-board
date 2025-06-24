import os
import logging
from typing import Dict, Any
from google import genai
from google.genai import types
from ..utils.url_extractor import extract_urls_from_text

logger = logging.getLogger(__name__)

class GeminiSearch:
    """Service for performing web searches using Gemini's grounding parameter."""
    
    def __init__(self):
        self.api_key = os.getenv('GOOGLE_API_KEY')
        if not self.api_key:
            raise ValueError("GOOGLE_API_KEY environment variable is required")
        
        # Configure the client
        genai.configure(api_key=self.api_key)
        self.client = genai.Client()
        
        # Define the grounding tool
        self.grounding_tool = types.Tool(
            google_search=types.GoogleSearch()
        )
        
        # Configure generation settings
        self.config = types.GenerateContentConfig(
            tools=[self.grounding_tool]
        )
    
    def search(self, query: str) -> Dict[str, Any]:
        """
        Perform web search using Gemini's grounding parameter and extract URLs.
        
        Args:
            query: Search query string
            
        Returns:
            Dictionary containing search results and extracted URLs
        """
        try:
            logger.info(f"Using Gemini for web search: {query}")
            
            # Make the request with grounding
            response = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=query,
                config=self.config,
            )
            
            result = response.text
            urls = extract_urls_from_text(result)
            
            logger.info("Gemini web search completed successfully")
            return {
                "content": result,
                "urls": urls
            }
            
        except Exception as e:
            logger.warning(f"Gemini web search failed: {str(e)}")
            return {
                "content": f"Unable to perform Gemini web search for: {query}",
                "urls": []
            } 