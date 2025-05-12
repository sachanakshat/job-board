import logging
import json
from playwright.async_api import async_playwright, Error as PlaywrightError
from ..config.browser_config import BROWSER_CONFIG, ANTI_DETECTION_SCRIPT, PROXY_CONFIG
from ..utils.human_behavior import human_like_delay
from .job_processor import setup_artifacts_directory, process_job_with_apply, save_job_data, process_job

logger = logging.getLogger(__name__)

async def create_browser_context(p, use_proxy=True):
    """Create browser context with optional proxy."""
    try:
        if use_proxy:
            logger.info("Attempting to launch browser with proxy...")
            browser = await p.chromium.launch(
                headless=False,
                args=BROWSER_CONFIG['launch_args']
            )
            
            # Create context with proxy
            context = await browser.new_context(
                **BROWSER_CONFIG['context'],
                proxy={
                    'server': PROXY_CONFIG['server']
                }
            )
            return browser, context
        else:
            logger.info("Launching browser without proxy...")
            browser = await p.chromium.launch(
                headless=False,
                args=BROWSER_CONFIG['launch_args']
            )
            context = await browser.new_context(**BROWSER_CONFIG['context'])
            return browser, context
    except PlaywrightError as e:
        if use_proxy and PROXY_CONFIG['fallback']:
            logger.warning(f"Proxy connection failed: {str(e)}. Falling back to direct connection...")
            return await create_browser_context(p, use_proxy=False)
        raise

async def scrape_jobs(job_type="devops_engineer", limit=3, cookies=None):
    """Scrape jobs and return the results."""
    dirs = setup_artifacts_directory(job_type)
    dirs["raw"].mkdir(exist_ok=True)
    dirs["parsed"].mkdir(exist_ok=True)
    
    async with async_playwright() as p:
        try:
            # Launch browser with proxy (will fall back to direct if proxy fails)
            browser, context = await create_browser_context(p)
            
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
            
            # Add anti-detection script
            await page.add_init_script(ANTI_DETECTION_SCRIPT)
            
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
                save_job_data(jobs, dirs["raw"] / "job_listings.json")
                logger.info(f"Saved raw job listings to {dirs['raw'] / 'job_listings.json'}")
                
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
                        job_id = processed_job['job_id']
                        job_file = dirs["parsed"] / f"job_{job_id}.json"
                        save_job_data(processed_job, job_file)
                        logger.info(f"Saved parsed job to {job_file}")
                    
                    if i < limit - 1:
                        await human_like_delay()
                
                # Save combined processed jobs
                save_job_data(processed_jobs, dirs["run"] / "processed_jobs.json")
                logger.info(f"Saved combined processed jobs to {dirs['run'] / 'processed_jobs.json'}")
                
                return {
                    "status": "success",
                    "message": f"Processed {len(processed_jobs)} jobs",
                    "data": processed_jobs,
                    "run_directory": str(dirs["run"])
                }
                
            except Exception as e:
                logger.error(f"An error occurred during scraping: {str(e)}")
                return {
                    "status": "error",
                    "message": str(e)
                }
            finally:
                await browser.close()
                
        except Exception as e:
            logger.error(f"An error occurred during browser setup: {str(e)}")
            return {
                "status": "error",
                "message": str(e)
            } 