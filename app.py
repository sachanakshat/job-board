from flask import Flask, jsonify, request
from board import process_job, parse_job_description
from playwright.async_api import async_playwright
import asyncio
import json
from datetime import datetime
import os
from pathlib import Path
import logging
from dotenv import load_dotenv
import random

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

def setup_artifacts_directory(job_type):
    """Create and return the artifacts directory structure for this run."""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    base_dir = Path("artifacts/remoteok")
    job_type_dir = base_dir / job_type
    run_dir = job_type_dir / timestamp
    
    # Create directories if they don't exist
    run_dir.mkdir(parents=True, exist_ok=True)
    
    return {
        "base": base_dir,
        "job_type": job_type_dir,
        "run": run_dir,
        "raw": run_dir / "raw",
        "parsed": run_dir / "parsed"
    }

async def human_like_delay():
    """Add random delay to simulate human behavior."""
    await asyncio.sleep(random.uniform(1.5, 3.5))

async def human_like_mouse_movement(page, element):
    """Simulate human-like mouse movement to an element."""
    # Get element position
    box = await element.bounding_box()
    if not box:
        return
    
    # Move mouse in a natural curve
    current_x, current_y = 0, 0
    target_x, target_y = box['x'] + box['width']/2, box['y'] + box['height']/2
    
    # Create a curved path
    steps = random.randint(10, 20)
    for i in range(steps):
        progress = i / steps
        # Add some randomness to the curve
        curve_x = current_x + (target_x - current_x) * progress + random.uniform(-10, 10)
        curve_y = current_y + (target_y - current_y) * progress + random.uniform(-10, 10)
        await page.mouse.move(curve_x, curve_y)
        await asyncio.sleep(random.uniform(0.01, 0.03))

async def process_job_with_apply(job, page):
    """Process a job and click apply button with human-like behavior."""
    try:
        # Navigate to job page
        job_url = f"https://remoteok.com/remote-jobs/{job['job_id']}"
        await page.goto(job_url)
        await human_like_delay()
        
        # Scroll down slowly to simulate reading
        for _ in range(3):
            await page.mouse.wheel(0, random.randint(300, 500))
            await human_like_delay()
        
        # Find and click apply button
        apply_button = await page.query_selector('a.action-apply')
        if apply_button:
            # Move mouse to button naturally
            await human_like_mouse_movement(page, apply_button)
            await human_like_delay()
            
            # Click with random delay
            await apply_button.click()
            await human_like_delay()
            
            # Check if we need to handle any popups or forms
            try:
                # Wait for potential popup
                popup = await page.wait_for_selector('.modal', timeout=5000)
                if popup:
                    # Close popup if it exists
                    close_button = await popup.query_selector('.close')
                    if close_button:
                        await human_like_mouse_movement(page, close_button)
                        await close_button.click()
            except:
                pass  # No popup found, continue
        
        return True
    except Exception as e:
        logger.error(f"Error processing job {job['job_id']}: {str(e)}")
        return False

async def scrape_jobs(job_type="devops_engineer", limit=3, cookies=None):
    """Scrape jobs and return the results."""
    dirs = setup_artifacts_directory(job_type)
    dirs["raw"].mkdir(exist_ok=True)
    dirs["parsed"].mkdir(exist_ok=True)
    
    async with async_playwright() as p:
        # Launch browser in headed mode with additional arguments to avoid detection
        browser = await p.chromium.launch(
            headless=False,
            args=[
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-blink-features=AutomationControlled',
                '--disable-infobars',
                '--window-size=1920,1080',
                '--start-maximized'
            ]
        )
        
        # Create context with additional settings
        context = await browser.new_context(
            user_agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
            viewport={'width': 1920, 'height': 1080},
            locale='en-US',
            timezone_id='America/New_York',
            permissions=['geolocation'],
            extra_http_headers={
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'none',
                'Sec-Fetch-User': '?1'
            }
        )
        
        # Set cookies if provided
        if cookies:
            await context.add_cookies([
                {
                    'name': cookie.split('=')[0].strip(),
                    'value': cookie.split('=')[1].strip(),
                    'domain': '.remoteok.com',
                    'path': '/'
                }
                for cookie in cookies.split(';')
            ])
        
        page = await context.new_page()
        
        # Add additional anti-detection measures
        await page.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined
            });
        """)
        
        try:
            # Navigate to remoteok.com/devops-jobs
            logger.info("Navigating to remoteok.com/remote-devops-jobs")
            await page.goto('https://remoteok.com/remote-devops-jobs')
            await human_like_delay()
            
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
            
            # Save raw job listings
            raw_jobs_file = dirs["raw"] / "job_listings.json"
            with open(raw_jobs_file, 'w', encoding='utf-8') as f:
                json.dump(jobs, f, indent=2, ensure_ascii=False)
            logger.info(f"Saved raw job listings to {raw_jobs_file}")
            
            # Process jobs
            processed_jobs = []
            for i, job in enumerate(jobs[:limit]):
                logger.info(f"Processing job {i+1}/{limit}: {job['position']} at {job['company']}")
                
                # Process job and click apply
                await process_job_with_apply(job, page)
                
                processed_job = await process_job(job, p)
                if processed_job:
                    processed_jobs.append(processed_job)
                    
                    # Save individual parsed job
                    job_file = dirs["parsed"] / f"job_{processed_job['job_id']}.json"
                    with open(job_file, 'w', encoding='utf-8') as f:
                        json.dump(processed_job, f, indent=2, ensure_ascii=False)
                    logger.info(f"Saved parsed job to {job_file}")
                
                if i < limit - 1:
                    await human_like_delay()
            
            # Save combined processed jobs
            combined_file = dirs["run"] / "processed_jobs.json"
            with open(combined_file, 'w', encoding='utf-8') as f:
                json.dump(processed_jobs, f, indent=2, ensure_ascii=False)
            logger.info(f"Saved combined processed jobs to {combined_file}")
            
            return {
                "status": "success",
                "message": f"Processed {len(processed_jobs)} jobs",
                "data": processed_jobs,
                "run_directory": str(dirs["run"])
            }
            
        except Exception as e:
            logger.error(f"An error occurred: {str(e)}")
            return {
                "status": "error",
                "message": str(e)
            }
        finally:
            await browser.close()

@app.route('/api/scrape', methods=['POST'])
def start_scraping():
    """API endpoint to start the scraping process."""
    try:
        job_type = request.json.get('job_type', 'devops_engineer')
        limit = request.json.get('limit', 3)
        cookies = request.json.get('cookies')
        
        # Run the scraping process
        result = asyncio.run(scrape_jobs(job_type, limit, cookies))
        return jsonify(result)
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/api/jobs')
def get_jobs():
    """API endpoint to get the latest scraped jobs."""
    try:
        # Get the latest run directory
        base_dir = Path("artifacts/remoteok/devops_engineer")
        if not base_dir.exists():
            return jsonify({
                "status": "error",
                "message": "No jobs have been scraped yet"
            }), 404
            
        # Get the most recent run directory
        run_dirs = sorted([d for d in base_dir.iterdir() if d.is_dir()], reverse=True)
        if not run_dirs:
            return jsonify({
                "status": "error",
                "message": "No jobs have been scraped yet"
            }), 404
            
        latest_run = run_dirs[0]
        jobs_file = latest_run / "processed_jobs.json"
        
        if not jobs_file.exists():
            return jsonify({
                "status": "error",
                "message": "No processed jobs found in the latest run"
            }), 404
            
        with open(jobs_file, 'r', encoding='utf-8') as f:
            jobs = json.load(f)
            
        return jsonify({
            "status": "success",
            "data": jobs,
            "run_directory": str(latest_run)
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True) 