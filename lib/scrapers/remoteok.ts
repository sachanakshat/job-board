import axios from 'axios';

interface Job {
  jobId: string;
  position: string;
  company: string;
  location: string;
  salary: string;
  tags: string[];
  posted: string;
  jobUrl: string;
  description: string;
  parsedDescription: {
    requirements: string[];
    responsibilities: string[];
    benefits: string[];
  };
}

export async function scrapeRemoteOK(title: string, limit: number = 10): Promise<Job[]> {
  try {
    const response = await axios.get('https://remoteok.io/api', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const jobs: Job[] = [];
    const apiJobs = response.data.slice(1); // First item is a notice

    for (const apiJob of apiJobs) {
      if (jobs.length >= limit) break;

      const jobTitle = apiJob.position;
      if (jobTitle.toLowerCase().includes(title.toLowerCase())) {
        const job: Job = {
          jobId: apiJob.id.toString(),
          position: jobTitle,
          company: apiJob.company,
          location: apiJob.location || 'Remote',
          salary: apiJob.salary || '',
          tags: apiJob.tags || [],
          posted: apiJob.date,
          jobUrl: `https://remoteok.io/l/${apiJob.id}`,
          description: apiJob.description || '',
          parsedDescription: {
            requirements: [],
            responsibilities: [],
            benefits: []
          }
        };

        // Basic parsing of description sections
        const description = job.description.toLowerCase();
        if (description.includes('requirements')) {
          job.parsedDescription.requirements = description
            .split('requirements')[1]
            .split('\n')
            .filter((line: string) => line.trim().startsWith('-'))
            .map((line: string) => line.replace('-', '').trim());
        }
        if (description.includes('responsibilities')) {
          job.parsedDescription.responsibilities = description
            .split('responsibilities')[1]
            .split('\n')
            .filter((line: string) => line.trim().startsWith('-'))
            .map((line: string) => line.replace('-', '').trim());
        }
        if (description.includes('benefits')) {
          job.parsedDescription.benefits = description
            .split('benefits')[1]
            .split('\n')
            .filter((line: string) => line.trim().startsWith('-'))
            .map((line: string) => line.replace('-', '').trim());
        }

        jobs.push(job);
      }
    }

    return jobs;
  } catch (error) {
    console.error('Error scraping RemoteOK:', error);
    throw new Error('Failed to scrape RemoteOK jobs');
  }
} 