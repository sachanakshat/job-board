import re
from typing import List

def extract_urls_from_text(text: str) -> List[str]:
    """
    Extract URLs from text using regex.
    
    Args:
        text: Text content to extract URLs from
        
    Returns:
        List of unique URLs found in the text
    """
    url_pattern = r'https?://(?:[-\w.])+(?:[:\d]+)?(?:/(?:[\w/_.])*(?:\?(?:[\w&=%.])*)?(?:#(?:[\w.])*)?)?'
    urls = re.findall(url_pattern, text)
    return list(set(urls))  # Remove duplicates 