import asyncio
import argparse
from playwright.async_api import async_playwright
from job_boards.remoteok.board import RemoteOKBoard
from job_boards.weworkremotely.board import WeWorkRemotelyBoard
from job_boards.wellfound.board import WellFoundBoard

async def main():
    parser = argparse.ArgumentParser(description='Job Board Scraper')
    parser.add_argument('--board', choices=['remoteok', 'weworkremotely', 'wellfound'], 
                      default='remoteok', help='Job board to scrape')
    parser.add_argument('--title', default='DevOps Engineer', 
                      help='Job title to search for')
    parser.add_argument('--limit', type=int, default=3, 
                      help='Number of jobs to process')
    args = parser.parse_args()

    # Initialize the appropriate job board
    if args.board == 'remoteok':
        board = RemoteOKBoard(args.title)
    elif args.board == 'weworkremotely':
        board = WeWorkRemotelyBoard(args.title)
    elif args.board == 'wellfound':
        board = WellFoundBoard(args.title)

    async with async_playwright() as playwright:
        # Launch browser and navigate to search URL
        browser = await playwright.chromium.launch(headless=False)
        page = await browser.new_page()
        
        try:
            # Navigate to the job board's search URL
            await page.goto(board.search_url)
            
            # Extract job listings
            jobs = await board.extract_job_listings(page)
            print(f"\nFound {len(jobs)} jobs")
            
            # Process jobs
            processed_jobs = []
            for i, job in enumerate(jobs[:args.limit]):
                print(f"\nProcessing job {i+1}/{args.limit}: {job['position']} at {job['company']}")
                
                # Process job in a new browser window
                processed_job = await board.process_job(job, playwright)
                if processed_job:
                    processed_jobs.append(processed_job)
                
                # Wait between jobs to avoid rate limiting
                if i < args.limit - 1:
                    await asyncio.sleep(3)
            
            print(f"\nSuccessfully processed {len(processed_jobs)} jobs")
            
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(main()) 