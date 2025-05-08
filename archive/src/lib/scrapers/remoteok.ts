import playwright from 'playwright';

interface Job {
  jobId: string;
  position: string;
  company: string;
  location: string;
  salary: string;
  tags: string[];
  posted: string;
  jobUrl: string;
  description?: string;
}

export async function scrapeRemoteOK(title: string, limit: number = 3): Promise<Job[]> {
  const browser = await playwright.chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Format the search query
    const searchQuery = title.toLowerCase().replace(/\s+/g, '-');
    await page.goto(`https://remoteok.com/remote-${searchQuery}-jobs`);

    // Wait for job listings to load
    await page.waitForSelector('tr.job', { timeout: 10000 });

    // Extract job data
    const jobs = await page.$$eval('tr.job', (elements, maxJobs) => {
      return elements.slice(0, maxJobs).map(el => {
        const jobId = el.getAttribute('data-id') || '';
        const position = el.querySelector('h2')?.textContent?.trim() || '';
        const company = el.querySelector('.company')?.textContent?.trim() || '';
        const location = el.querySelector('.location')?.textContent?.trim() || 'Remote';
        const salary = el.querySelector('.salary')?.textContent?.trim() || '';
        const tags = Array.from(el.querySelectorAll('.tag')).map(tag => tag.textContent?.trim()).filter(Boolean) as string[];
        const posted = el.querySelector('time')?.getAttribute('datetime') || '';
        const jobUrl = `https://remoteok.com/remote-jobs/${jobId}`;

        return {
          jobId,
          position,
          company,
          location,
          salary,
          tags,
          posted,
          jobUrl
        };
      });
    }, limit) as Job[];

    // Get detailed job descriptions
    for (const job of jobs) {
      await page.goto(job.jobUrl);
      await page.waitForSelector('.description', { timeout: 10000 });
      
      const description = await page.$eval('.description', el => el.textContent?.trim() || '');
      job.description = description;
    }

    return jobs;
  } catch (error) {
    console.error('Error scraping RemoteOK:', error);
    throw error;
  } finally {
    await browser.close();
  }
} 