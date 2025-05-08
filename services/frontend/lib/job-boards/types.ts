import { Page } from 'playwright';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary?: string;
  url: string;
  postedAt?: Date;
  tags?: string[];
  source: string;
}

export interface JobBoard {
  searchUrl: string;
  extractJobListings(page: Page): Promise<Job[]>;
  processJob(job: Job, page: Page): Promise<Job | null>;
} 