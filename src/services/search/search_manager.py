import logging
from typing import Dict, Any, Optional
from .groq_search import GroqSearch
from .gemini_search import GeminiSearch
from .playwright_search import PlaywrightSearch

logger = logging.getLogger(__name__)

class SearchManager:
    """Manages search operations with configurable providers and fallback logic."""
    
    def __init__(self, primary_provider: str = "groq"):
        """
        Initialize search manager with specified primary provider.
        
        Args:
            primary_provider: Primary search provider ("groq" or "gemini")
        """
        self.primary_provider = primary_provider.lower()
        
        # Initialize search providers
        self.groq_search = None
        self.gemini_search = None
        self.playwright_search = PlaywrightSearch()
        
        # Initialize primary provider
        if self.primary_provider == "groq":
            try:
                self.groq_search = GroqSearch()
                logger.info("Initialized GROQ search as primary provider")
            except Exception as e:
                logger.warning(f"Failed to initialize GROQ search: {e}")
                self.primary_provider = "gemini"
        
        if self.primary_provider == "gemini":
            try:
                self.gemini_search = GeminiSearch()
                logger.info("Initialized Gemini search as primary provider")
            except Exception as e:
                logger.warning(f"Failed to initialize Gemini search: {e}")
                if self.groq_search:
                    self.primary_provider = "groq"
                else:
                    logger.error("No search providers available")
    
    def search_with_fallback(self, query: str) -> Dict[str, Any]:
        """
        Search with configurable primary provider and Playwright as fallback.
        
        Args:
            query: Search query string
            
        Returns:
            Dictionary containing search results and extracted URLs
        """
        # Try primary provider first
        if self.primary_provider == "groq" and self.groq_search:
            groq_result = self.groq_search.search(query)
            if not groq_result["content"].startswith("Unable to perform GROQ web search"):
                return groq_result
            logger.info("GROQ search failed, trying Gemini...")
        
        if self.primary_provider == "gemini" and self.gemini_search:
            gemini_result = self.gemini_search.search(query)
            if not gemini_result["content"].startswith("Unable to perform Gemini web search"):
                return gemini_result
            logger.info("Gemini search failed, trying GROQ...")
        
        # Try secondary provider
        if self.primary_provider == "groq" and self.gemini_search:
            gemini_result = self.gemini_search.search(query)
            if not gemini_result["content"].startswith("Unable to perform Gemini web search"):
                return gemini_result
        elif self.primary_provider == "gemini" and self.groq_search:
            groq_result = self.groq_search.search(query)
            if not groq_result["content"].startswith("Unable to perform GROQ web search"):
                return groq_result
        
        # Use Playwright as final fallback
        logger.info("All AI search providers failed, using Playwright fallback")
        return self.playwright_search.search_sync(query)
    
    def search_with_provider(self, query: str, provider: str) -> Dict[str, Any]:
        """
        Search using a specific provider.
        
        Args:
            query: Search query string
            provider: Specific provider to use ("groq", "gemini", "playwright")
            
        Returns:
            Dictionary containing search results and extracted URLs
        """
        provider = provider.lower()
        
        if provider == "groq" and self.groq_search:
            return self.groq_search.search(query)
        elif provider == "gemini" and self.gemini_search:
            return self.gemini_search.search(query)
        elif provider == "playwright":
            return self.playwright_search.search_sync(query)
        else:
            logger.warning(f"Provider {provider} not available, using fallback")
            return self.search_with_fallback(query)
    
    def get_available_providers(self) -> list:
        """
        Get list of available search providers.
        
        Returns:
            List of available provider names
        """
        providers = []
        if self.groq_search:
            providers.append("groq")
        if self.gemini_search:
            providers.append("gemini")
        providers.append("playwright")  # Always available as fallback
        return providers 