import { chromium } from 'playwright';
import { RemoteOKBoard } from './remoteok/board';
import { WeWorkRemotelyBoard } from './weworkremotely/board';
import { WellFoundBoard } from './wellfound/board';

interface JobBoardOptions {
  board: string;
  title: string;
  limit?: number;
}

async function retry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      console.log(`Attempt ${i + 1} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Retry failed');
}

export async function searchJobs(board: string, title: string, limit: number = 3) {
  // Initialize the appropriate job board
  let jobBoard;
  switch (board) {
    case 'remoteok':
      jobBoard = new RemoteOKBoard(title);
      break;
    case 'weworkremotely':
      jobBoard = new WeWorkRemotelyBoard(title);
      break;
    case 'wellfound':
      jobBoard = new WellFoundBoard(title);
      break;
    default:
      throw new Error('Invalid board selection');
  }

  const browser = await chromium.launch({ 
    headless: true,
    args: ['--disable-web-security', '--no-sandbox']
  });
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  });
  
  const page = await context.newPage();

  try {
    console.log(`\nNavigating to ${jobBoard.searchUrl}`);
    
    // Navigate to the job board's search URL with retry logic
    await retry(async () => {
      await page.goto(jobBoard.searchUrl, { 
        waitUntil: 'networkidle',
        timeout: 30000 
      });
    });

    // Extract job listings
    console.log('Extracting job listings...');
    const jobs = await jobBoard.extractJobListings(page);
    console.log(`\nFound ${jobs.length} jobs`);

    // Process jobs
    const processedJobs = [];
    const groqResponses = [];
    const metadata = [];

    for (let i = 0; i < Math.min(jobs.length, limit); i++) {
      const job = jobs[i];
      console.log(`\nProcessing job ${i + 1}/${limit}: ${job.position} at ${job.company}`);

      // Process job in a new browser window with retry logic
      const processedJob = await retry(async () => {
        return await jobBoard.processJob(job, browser);
      });

      if (processedJob) {
        processedJobs.push(processedJob);
        
        // Save Groq response separately
        if (processedJob.parsedDescription) {
          const groqResponse = {
            jobId: processedJob.jobId,
            position: processedJob.position,
            company: processedJob.company,
            parsedDescription: processedJob.parsedDescription
          };
          groqResponses.push(groqResponse);
          
          // Save individual GROQ response
          await jobBoard.saveToJson(
            groqResponse,
            board,
            'groq_responses',
            `groq_response_${processedJob.jobId}`
          );
        }

        // Save metadata separately
        metadata.push({
          jobId: processedJob.jobId,
          position: processedJob.position,
          company: processedJob.company,
          location: processedJob.location,
          salary: processedJob.salary,
          tags: processedJob.tags,
          posted: processedJob.posted,
          views: processedJob.views,
          applicants: processedJob.applicants,
          applyPercentage: processedJob.applyPercentage,
          jobUrl: processedJob.jobUrl
        });
      }

      // Wait between jobs to avoid rate limiting
      if (i < limit - 1) {
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }

    console.log(`\nSuccessfully processed ${processedJobs.length} jobs`);

    // Save processed data in separate files
    if (processedJobs.length > 0) {
      // Save complete job listings with all details
      await jobBoard.saveToJson(processedJobs, board, 'job_listings');
      
      // Save all GROQ responses in one file
      await jobBoard.saveToJson(groqResponses, board, 'groq_responses', 'all_groq_responses');
      
      // Save metadata
      await jobBoard.saveToJson(metadata, board, 'metadata');
    }

    return processedJobs;

  } catch (error: unknown) {
    console.error('Error:', error instanceof Error ? error.message : String(error));
    throw error;
  } finally {
    await browser.close();
  }
} 