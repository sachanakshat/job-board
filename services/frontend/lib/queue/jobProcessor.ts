import Queue from 'bull';
import { connectDB } from '@/lib/db/mongodb';
import { Job } from '@/lib/models/Job';
import { scrapeRemoteOK } from '@/lib/scrapers/remoteok';

// Create a new queue
export const jobQueue = new Queue('job-queue', {
  redis: {
    host: 'localhost',
    port: 6379
  }
});

// Process jobs
jobQueue.process('scrape', async (job) => {
  const { jobId, board, title, limit } = job.data;

  try {
    await connectDB();
    const jobDoc = await Job.findOne({ jobId });

    if (!jobDoc) {
      throw new Error('Job not found');
    }

    // Update job status to processing
    jobDoc.status = 'processing';
    jobDoc.updatedAt = new Date();
    await jobDoc.save();

    // Scrape jobs based on board
    let results;
    switch (board.toLowerCase()) {
      case 'remoteok':
        results = await scrapeRemoteOK(title, limit);
        break;
      default:
        throw new Error(`Unsupported board: ${board}`);
    }

    // Update job with results
    jobDoc.status = 'completed';
    jobDoc.result = results;
    jobDoc.updatedAt = new Date();
    await jobDoc.save();

    return results;
  } catch (error) {
    console.error('Error processing job:', error);

    // Update job with error
    const jobDoc = await Job.findOne({ jobId });
    if (jobDoc) {
      jobDoc.status = 'failed';
      jobDoc.error = error instanceof Error ? error.message : 'Unknown error';
      jobDoc.updatedAt = new Date();
      await jobDoc.save();
    }

    throw error;
  }
}); 