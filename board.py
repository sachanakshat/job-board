from playwright.async_api import async_playwright
import asyncio
import json
from datetime import datetime
import aiohttp
import time
import re
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get API key from environment variable
GROQ_API_KEY = os.getenv('GROQ_API_KEY')
if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY environment variable is not set")

def clean_groq_response(text):
    """Clean the Groq response to extract valid JSON."""
    # Remove markdown code block markers if present
    text = re.sub(r'```json\s*', '', text)
    text = re.sub(r'```\s*$', '', text)
    
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

async def parse_job_description(text):
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
                
                return clean_groq_response(parsed_text)
                
        except Exception as e:
            return {"error": f"Request failed: {str(e)}"}

async def process_job(job, playwright):
    """Process a single job in its own browser window."""
    browser = await playwright.chromium.launch(headless=False)
    page = await browser.new_page()
    
    try:
        # Navigate to the job listing
        job_url = f"https://remoteok.com/remote-jobs/{job['job_id']}"
        await page.goto(job_url)
        
        # Wait for the content to load
        await page.wait_for_selector('.description', timeout=10000)
        
        # Get the full job description
        full_description = await page.evaluate('''() => {
            const desc = document.querySelector('.description');
            if (!desc) return '';
            // Remove any script tags
            Array.from(desc.querySelectorAll('script')).forEach(s => s.remove());
            return desc.textContent.trim();
        }''')
        
        # Extract additional job details
        job_details = await page.evaluate('''() => {
            const details = {};
            
            // Get exact posting time from datetime attribute
            const timeElement = document.querySelector('time');
            if (timeElement) {
                details.posted = timeElement.getAttribute('datetime');
            }
            
            // Get company profile stats
            const companyProfile = document.querySelector('.company_profile');
            if (companyProfile) {
                const paragraphs = companyProfile.querySelectorAll('p');
                if (paragraphs.length >= 2) {
                    // First paragraph contains views
                    details.views = paragraphs[0].innerText.trim();
                    
                    // Second paragraph contains applicants and apply percentage
                    const applyStats = paragraphs[1].innerText.trim();
                    const applicantsMatch = applyStats.match(/(\d+)\s+applied/);
                    const percentageMatch = applyStats.match(/\((\d+)%\)/);
                    
                    if (applicantsMatch) details.applicants = applicantsMatch[1];
                    if (percentageMatch) details.apply_percentage = percentageMatch[1] + '%';
                }
            }
            
            return details;
        }''')
        
        print(f"\nJob Description Length: {len(full_description)} characters")
        
        # Parse the description using Groq API
        parsed_description = await parse_job_description(full_description)
        
        # Add the parsed description and additional details to the job data
        job['parsed_description'] = parsed_description
        job['job_url'] = job_url
        job['posted'] = job_details.get('posted', '')
        job['views'] = job_details.get('views', '')
        job['applicants'] = job_details.get('applicants', '')
        job['apply_percentage'] = job_details.get('apply_percentage', '')
            
        return job
        
    except Exception as e:
        print(f"Error processing job {job['position']}: {str(e)}")
        return None
        
    finally:
        await browser.close()

async def main():
    async with async_playwright() as p:
        # Launch the main browser for job listings
        browser = await p.chromium.launch(headless=False)
        page = await browser.new_page()
        
        # Navigate to remoteok.com/devops-jobs
        await page.goto('https://remoteok.com/remote-devops-jobs')
        
        # Wait for the job listings to load
        await page.wait_for_selector('tr.job')
        
        # Extract job information
        jobs = await page.evaluate('''() => {
            const jobs = [];
            document.querySelectorAll('tr.job').forEach(job => {
                const jobData = {
                    position: job.querySelector('h2')?.textContent?.trim() || '',
                    company: job.querySelector('h3')?.textContent?.trim() || '',
                    location: job.querySelector('.location')?.textContent?.trim() || '',
                    salary: job.querySelector('.salary')?.textContent?.trim() || '',
                    tags: Array.from(job.querySelectorAll('.tags .tag')).map(tag => tag.textContent.trim()),
                    posted: '',
                    description: job.querySelector('.description')?.textContent?.trim() || '',
                    job_id: job.getAttribute('data-id') || ''
                };
                jobs.push(jobData);
            });
            return jobs;
        }''')
        
        # Close the main browser
        await browser.close()
        
        # Process only the first 3 jobs
        processed_jobs = []
        for i, job in enumerate(jobs[:3]):
            print(f"\nProcessing job {i+1}/3: {job['position']} at {job['company']}")
            
            # Process the job in a new browser window
            processed_job = await process_job(job, p)
            if processed_job:
                processed_jobs.append(processed_job)
            
            # Wait 3 seconds before processing the next job
            if i < 2:  # Don't wait after the last job
                await asyncio.sleep(3)
        
        # Save to JSON file
        with open('devops_jobs_detailed.json', 'w', encoding='utf-8') as f:
            json.dump(processed_jobs, f, indent=2, ensure_ascii=False)
        
        print(f"\nProcessed {len(processed_jobs)} jobs. Data saved to devops_jobs_detailed.json")

if __name__ == "__main__":
    asyncio.run(main())
