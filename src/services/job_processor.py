import logging
from pathlib import Path
import json
from datetime import datetime
import random
import asyncio
from ..utils.human_behavior import human_like_delay, human_like_mouse_movement
from board import process_job

logger = logging.getLogger(__name__)

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

async def process_job_with_apply(job, page):
    """Process a job and wait for user to click apply button."""
    try:
        # Navigate to job page
        job_url = f"https://remoteok.com/remote-jobs/{job['job_id']}"
        await page.goto(job_url)
        await human_like_delay()
        
        # Scroll down slowly to simulate reading
        for _ in range(3):
            await page.mouse.wheel(0, random.randint(300, 500))
            await human_like_delay()
        
        # Find apply button
        apply_button = await page.query_selector('a.action-apply')
        if apply_button:
            logger.info(f"Waiting for user to click apply button for job {job['job_id']}...")
            
            # Wait for user to click the apply button
            try:
                # Wait for the button to be clicked or page to be closed
                await apply_button.wait_for_element_state('hidden', timeout=300000)  # 5 minutes timeout
                
                # Wait for 10 seconds after click
                logger.info("Apply button clicked. Waiting for 10 seconds...")
                await asyncio.sleep(10)
                
                # Close the page
                await page.close()
                logger.info("Page closed after apply.")
                
            except Exception as e:
                logger.warning(f"Timeout waiting for apply button click: {str(e)}")
                await page.close()
        
        return True
    except Exception as e:
        logger.error(f"Error processing job {job['job_id']}: {str(e)}")
        return False

def save_job_data(job_data, file_path):
    """Save job data to a JSON file."""
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(job_data, f, indent=2, ensure_ascii=False) 