from abc import ABC, abstractmethod
from datetime import datetime
import json
import os
from pathlib import Path
import aiohttp
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
GROQ_API_KEY = os.getenv('GROQ_API_KEY')
if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY environment variable is not set")

class BaseJobBoard(ABC):
    def __init__(self, job_title):
        self.job_title = job_title
        self.base_url = self.get_base_url()
        self.search_url = self.generate_search_url()
        
        # Create board-specific artifact directories
        self.board_name = self.__class__.__name__.lower().replace('board', '')
        self.artifacts_dir = Path("artifacts") / self.board_name / self.job_title.lower().replace(" ", "_")
        self.metadata_dir = self.artifacts_dir / "metadata"
        self.groq_dir = self.artifacts_dir / "groq_responses"
        self.job_listings_dir = self.artifacts_dir / "job_listings"
        
        # Create directories if they don't exist
        for directory in [self.metadata_dir, self.groq_dir, self.job_listings_dir]:
            directory.mkdir(parents=True, exist_ok=True)
    
    @abstractmethod
    def get_base_url(self):
        """Return the base URL for the job board."""
        pass
    
    @abstractmethod
    def generate_search_url(self):
        """Generate the search URL based on job title."""
        pass
    
    @abstractmethod
    async def extract_job_listings(self, page):
        """Extract job listings from the search page."""
        pass
    
    @abstractmethod
    async def process_job(self, job, playwright):
        """Process a single job listing."""
        pass
    
    async def parse_job_description(self, text):
        """Parse job description using GROQ API."""
        if not text:
            return {"error": "Empty description"}
            
        async with aiohttp.ClientSession() as session:
            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {GROQ_API_KEY}"
            }
            
            prompt = f"""Analyze the following job description and create a structured JSON representation of the key information. 
Organize the information in a way that makes sense for this specific job posting.
Focus on extracting the most important details that would help a candidate understand the role and requirements.

Here's the job description:
{text}

Return a JSON object with your analysis. Do not include any markdown formatting or additional text."""
            
            data = {
                "model": "meta-llama/llama-4-scout-17b-16e-instruct",
                "messages": [{
                    "role": "user",
                    "content": prompt
                }],
                "temperature": 0.1,
                "max_tokens": 2000
            }
            
            try:
                async with session.post(
                    "https://api.groq.com/openai/v1/chat/completions",
                    headers=headers,
                    json=data
                ) as response:
                    if response.status != 200:
                        return {"error": f"API error: {response.status}"}
                        
                    result = await response.json()
                    if "choices" not in result or not result["choices"]:
                        return {"error": "No choices in API response"}
                        
                    parsed_text = result["choices"][0]["message"]["content"]
                    print("\nRaw Groq Response:")
                    print("-" * 50)
                    print(parsed_text)
                    print("-" * 50)
                    
                    return self.clean_groq_response(parsed_text)
                    
            except Exception as e:
                return {"error": f"Request failed: {str(e)}"}
    
    def clean_groq_response(self, text):
        """Clean the Groq response to extract valid JSON."""
        # Remove markdown code block markers if present
        text = text.replace('```json', '').replace('```', '').strip()
        
        # Find the first { and last }
        json_start = text.find('{')
        json_end = text.rfind('}') + 1
        
        if json_start >= 0 and json_end > json_start:
            json_str = text[json_start:json_end]
            try:
                return json.loads(json_str)
            except json.JSONDecodeError as e:
                print(f"JSON decode error: {e}")
                print(f"Problematic JSON string: {json_str}")
                return {"error": f"JSON decode error: {str(e)}"}
        return {"error": "No JSON object found in response"}
    
    def save_metadata(self, job_id, metadata):
        """Save job metadata."""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{job_id}_{timestamp}_metadata.json"
        filepath = self.metadata_dir / filename
        
        # Add search context to metadata
        metadata.update({
            "search_context": {
                "job_board": self.board_name,
                "job_title": self.job_title,
                "search_url": self.search_url,
                "timestamp": timestamp
            }
        })
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(metadata, f, indent=2, ensure_ascii=False)
    
    def save_groq_response(self, job_id, response):
        """Save GROQ API response."""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{job_id}_{timestamp}_groq.json"
        filepath = self.groq_dir / filename
        
        # Add search context to GROQ response
        if isinstance(response, dict):
            response["search_context"] = {
                "job_board": self.board_name,
                "job_title": self.job_title,
                "timestamp": timestamp
            }
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(response, f, indent=2, ensure_ascii=False)
    
    def save_job_listing(self, job_id, job_data):
        """Save processed job listing."""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{job_id}_{timestamp}_listing.json"
        filepath = self.job_listings_dir / filename
        
        # Add search context to job listing
        job_data["search_context"] = {
            "job_board": self.board_name,
            "job_title": self.job_title,
            "search_url": self.search_url,
            "timestamp": timestamp
        }
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(job_data, f, indent=2, ensure_ascii=False) 