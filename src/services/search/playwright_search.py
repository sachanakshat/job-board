import logging
import asyncio
from typing import Dict, Any
from playwright.async_api import async_playwright

logger = logging.getLogger(__name__)

class PlaywrightSearch:
    """Service for performing web searches using Playwright as a fallback."""
    
    async def search(self, query: str) -> Dict[str, Any]:
        """
        Perform Google search using Playwright for fallback and extract URLs.
        
        Args:
            query: Search query string
            
        Returns:
            Dictionary containing search results and extracted URLs
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
    
    def search_sync(self, query: str) -> Dict[str, Any]:
        """
        Synchronous wrapper for the async search method.
        
        Args:
            query: Search query string
            
        Returns:
            Dictionary containing search results and extracted URLs
        """
        try:
            # Run the async search
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            result = loop.run_until_complete(self.search(query))
            loop.close()
            return result
        except Exception as e:
            logger.warning(f"Playwright search sync wrapper failed: {str(e)}")
            return {
                "content": f"Unable to perform web search for: {query}",
                "urls": []
            } 