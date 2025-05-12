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

async def scrape_jobs(job_type="devops_engineer", limit=3):
    """Scrape jobs and return the results."""
    dirs = setup_artifacts_directory(job_type)
    dirs["raw"].mkdir(exist_ok=True)
    dirs["parsed"].mkdir(exist_ok=True)
    
    async with async_playwright() as p:
        # Launch browser in headed mode
        browser = await p.chromium.launch(
            headless=False,  # Set to False to see the browser window
            args=['--no-sandbox', '--disable-setuid-sandbox']
        )
        page = await browser.new_page()
        
        try:
            # Navigate to remoteok.com/devops-jobs
            logger.info("Navigating to remoteok.com/remote-devops-jobs")
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
            
            # Save raw job listings
            raw_jobs_file = dirs["raw"] / "job_listings.json"
            with open(raw_jobs_file, 'w', encoding='utf-8') as f:
                json.dump(jobs, f, indent=2, ensure_ascii=False)
            logger.info(f"Saved raw job listings to {raw_jobs_file}")
            
            # Process jobs
            processed_jobs = []
            for i, job in enumerate(jobs[:limit]):
                logger.info(f"Processing job {i+1}/{limit}: {job['position']} at {job['company']}")
                
                processed_job = await process_job(job, p)
                if processed_job:
                    processed_jobs.append(processed_job)
                    
                    # Save individual parsed job
                    job_file = dirs["parsed"] / f"job_{processed_job['job_id']}.json"
                    with open(job_file, 'w', encoding='utf-8') as f:
                        json.dump(processed_job, f, indent=2, ensure_ascii=False)
                    logger.info(f"Saved parsed job to {job_file}")
                
                if i < limit - 1:
                    await asyncio.sleep(3)
            
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
        
        # Run the scraping process
        result = asyncio.run(scrape_jobs(job_type, limit))
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