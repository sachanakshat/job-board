import { BaseBoard, JobListing } from '../base';
import { Browser, Page } from 'playwright';

export class RemoteOKBoard extends BaseBoard {
  constructor(jobTitle: string) {
    super(jobTitle);
    this.searchUrl = `https://remoteok.com/remote-${jobTitle.toLowerCase().replace(/\s+/g, '-')}-jobs`;
  }

  async extractJobListings(page: Page): Promise<JobListing[]> {
    // Wait for the job listings to load
    await page.waitForSelector('table#jobsboard', { timeout: 30000 });

    // Extract job information
    return await page.evaluate(() => {
      const jobs: JobListing[] = [];
      document.querySelectorAll('tr.job').forEach(job => {
        try {
          const jobData: JobListing = {
            jobId: job.getAttribute('data-id') || '',
            position: job.querySelector('h2')?.textContent?.trim() || '',
            company: job.querySelector('h3')?.textContent?.trim() || '',
            location: job.querySelector('.location')?.textContent?.trim() || '',
            salary: job.querySelector('.salary')?.textContent?.trim() || '',
            tags: Array.from(job.querySelectorAll('.tags .tag')).map(tag => tag.textContent?.trim() || ''),
            posted: '',
            views: 0,
            applicants: 0,
            applyPercentage: 0,
            jobUrl: '',
            description: job.querySelector('.description')?.textContent?.trim() || ''
          };
          
          // Only add jobs that have at least a position and company
          if (jobData.position && jobData.company) {
            jobs.push(jobData);
          }
        } catch (error) {
          console.error('Error extracting job data:', error);
        }
      });
      return jobs;
    });
  }

  async processJob(job: JobListing, browser: Browser): Promise<JobListing | null> {
    const page = await browser.newPage();
    
    try {
      // Navigate to the job listing
      const jobUrl = `https://remoteok.com/remote-jobs/${job.jobId}`;
      console.log(`Processing job at: ${jobUrl}`);
      
      await page.goto(jobUrl, { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });

      // Wait for the content to load
      await page.waitForSelector('.description', { timeout: 30000 });

      // Get the full job description
      const fullDescription = await page.evaluate(() => {
        const desc = document.querySelector('.description');
        if (!desc) return '';
        
        // Remove any script tags and other unwanted elements
        const clone = desc.cloneNode(true) as HTMLElement;
        Array.from(clone.querySelectorAll('script, style, iframe')).forEach((el: Element) => el.remove());
        
        // Clean up the text
        return (clone.textContent || '')
          .replace(/\s+/g, ' ')
          .trim();
      });

      // Extract additional job details
      const jobDetails = await page.evaluate(() => {
        const details: {
          posted?: string;
          views?: string;
          applicants?: string;
          applyPercentage?: string;
        } = {};

        // Get exact posting time from datetime attribute
        const timeElement = document.querySelector('time');
        if (timeElement) {
          details.posted = timeElement.getAttribute('datetime') || '';
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
            if (percentageMatch) details.applyPercentage = percentageMatch[1] + '%';
          }
        }

        return details;
      });

      console.log(`\nJob Description Length: ${fullDescription.length} characters`);

      // Parse the description using Groq API
      const parsedDescription = await this.parseJobDescription(fullDescription);

      // Add the parsed description and additional details to the job data
      return {
        ...job,
        parsedDescription,
        jobUrl,
        posted: jobDetails.posted || '',
        views: parseInt(jobDetails.views || '0', 10),
        applicants: parseInt(jobDetails.applicants || '0', 10),
        applyPercentage: parseInt(jobDetails.applyPercentage?.replace('%', '') || '0', 10)
      };

    } catch (e) {
      console.error(`Error processing job ${job.position}: ${e.message}`);
      return null;
    } finally {
      await page.close();
    }
  }
} 