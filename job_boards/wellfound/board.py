from ..base import BaseJobBoard

class WellFoundBoard(BaseJobBoard):
    def __init__(self, job_title):
        super().__init__(job_title)
        self.base_url = "https://wellfound.com"
        self.search_url = f"{self.base_url}/jobs?query={job_title.replace(' ', '+')}"
    
    async def extract_job_listings(self, page):
        """Extract job listings from the search page."""
        return await page.evaluate('''() => {
            const jobs = [];
            document.querySelectorAll('.job-card').forEach(job => {
                const title = job.querySelector('.job-title');
                const company = job.querySelector('.company-name');
                const location = job.querySelector('.location');
                const tags = Array.from(job.querySelectorAll('.tag')).map(tag => tag.textContent.trim());
                
                if (title && company) {
                    jobs.push({
                        position: title.textContent.trim(),
                        company: company.textContent.trim(),
                        location: location ? location.textContent.trim() : 'Remote',
                        tags: tags,
                        job_id: job.getAttribute('data-job-id')
                    });
                }
            });
            return jobs;
        }''')
    
    async def process_job(self, job, playwright):
        """Process a single job listing."""
        browser = await playwright.chromium.launch(headless=False)
        page = await browser.new_page()
        
        try:
            # Navigate to the job listing
            job_url = f"{self.base_url}/jobs/{job['job_id']}"
            await page.goto(job_url)
            
            # Wait for the content to load
            await page.wait_for_selector('.job-description', timeout=10000)
            
            # Get the full job description
            full_description = await page.evaluate('''() => {
                const desc = document.querySelector('.job-description');
                if (!desc) return '';
                return desc.textContent.trim();
            }''')
            
            # Extract additional job details
            job_details = await page.evaluate('''() => {
                const details = {};
                
                // Get posting date
                const dateElement = document.querySelector('.posted-date');
                if (dateElement) {
                    details.posted = dateElement.getAttribute('datetime');
                }
                
                // Get job stats
                const stats = document.querySelectorAll('.job-stats .stat');
                stats.forEach(stat => {
                    const label = stat.querySelector('.label').textContent.trim();
                    const value = stat.querySelector('.value').textContent.trim();
                    details[label.toLowerCase()] = value;
                });
                
                return details;
            }''')
            
            print(f"\nJob Description Length: {len(full_description)} characters")
            
            # Save metadata
            metadata = {
                "job_id": job['job_id'],
                "position": job['position'],
                "company": job['company'],
                "location": job['location'],
                "tags": job['tags'],
                "job_url": job_url,
                "posted": job_details.get('posted', ''),
                "views": job_details.get('views', ''),
                "applicants": job_details.get('applicants', ''),
                "description_length": len(full_description)
            }
            self.save_metadata(job['job_id'], metadata)
            
            # Parse the description using Groq API
            parsed_description = await self.parse_job_description(full_description)
            
            # Save GROQ response
            self.save_groq_response(job['job_id'], parsed_description)
            
            # Add the parsed description and additional details to the job data
            job['parsed_description'] = parsed_description
            job['job_url'] = job_url
            job['posted'] = job_details.get('posted', '')
            job['views'] = job_details.get('views', '')
            job['applicants'] = job_details.get('applicants', '')
            
            # Save job listing
            self.save_job_listing(job['job_id'], job)
            
            return job
            
        except Exception as e:
            print(f"Error processing job {job['position']}: {str(e)}")
            return None
            
        finally:
            await browser.close() 