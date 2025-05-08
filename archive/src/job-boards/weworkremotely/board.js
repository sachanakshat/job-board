import { BaseBoard } from '../base.js';

export class WeWorkRemotelyBoard extends BaseBoard {
  constructor(jobTitle) {
    super(jobTitle);
    this.searchUrl = `https://weworkremotely.com/remote-jobs/search?term=${encodeURIComponent(jobTitle)}`;
  }

  async extractJobListings(page) {
    // Wait for the job listings to load
    await page.waitForSelector('.jobs-container');

    // Extract job information
    return await page.evaluate(() => {
      const jobs = [];
      document.querySelectorAll('.job-listing').forEach(job => {
        const jobData = {
          position: job.querySelector('.title')?.textContent?.trim() || '',
          company: job.querySelector('.company')?.textContent?.trim() || '',
          location: job.querySelector('.location')?.textContent?.trim() || '',
          salary: job.querySelector('.salary')?.textContent?.trim() || '',
          tags: Array.from(job.querySelectorAll('.tags .tag')).map(tag => tag.textContent.trim()),
          posted: job.querySelector('.date')?.textContent?.trim() || '',
          description: job.querySelector('.description')?.textContent?.trim() || '',
          jobId: job.getAttribute('data-id') || ''
        };
        jobs.push(jobData);
      });
      return jobs;
    });
  }

  async processJob(job, browser) {
    const page = await browser.newPage();

    try {
      // Navigate to the job listing
      const jobUrl = `https://weworkremotely.com/remote-jobs/${job.jobId}`;
      await page.goto(jobUrl);

      // Wait for the content to load
      await page.waitForSelector('.job-description', { timeout: 10000 });

      // Get the full job description
      const fullDescription = await page.evaluate(() => {
        const desc = document.querySelector('.job-description');
        if (!desc) return '';
        // Remove any script tags
        Array.from(desc.querySelectorAll('script')).forEach(s => s.remove());
        return desc.textContent.trim();
      });

      // Extract additional job details
      const jobDetails = await page.evaluate(() => {
        const details = {};

        // Get posting time
        const timeElement = document.querySelector('.date');
        if (timeElement) {
          details.posted = timeElement.textContent.trim();
        }

        // Get company profile stats
        const companyProfile = document.querySelector('.company-profile');
        if (companyProfile) {
          const stats = companyProfile.querySelectorAll('.stat');
          stats.forEach(stat => {
            const label = stat.querySelector('.label')?.textContent?.trim().toLowerCase();
            const value = stat.querySelector('.value')?.textContent?.trim();
            if (label && value) {
              details[label] = value;
            }
          });
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
        views: jobDetails.views || '',
        applicants: jobDetails.applicants || '',
        applyPercentage: jobDetails.applyPercentage || ''
      };

    } catch (e) {
      console.error(`Error processing job ${job.position}: ${e.message}`);
      return null;
    } finally {
      await page.close();
    }
  }
} 