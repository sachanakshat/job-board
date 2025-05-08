import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { join } from 'path';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { Browser, Page } from 'playwright';
import { Job, JobBoard } from './types';

dotenv.config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;
if (!GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY environment variable is not set");
}

interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export interface JobListing {
  jobId: string;
  position: string;
  company: string;
  location: string;
  salary: string;
  tags: string[];
  posted: string;
  views: number;
  applicants: number;
  applyPercentage: number;
  jobUrl: string;
  description?: string;
  parsedDescription?: any;
}

export abstract class BaseJobBoard implements JobBoard {
  protected jobTitle: string;
  protected baseDir: string;
  public searchUrl: string = '';

  constructor(jobTitle: string) {
    this.jobTitle = jobTitle;
    this.baseDir = this.getBaseDir();
    this.searchUrl = this.generateSearchUrl();
  }

  abstract getBaseDir(): string;
  abstract generateSearchUrl(): string;
  abstract extractJobListings(page: Page): Promise<Job[]>;
  abstract processJob(job: Job, page: Page): Promise<Job | null>;

  protected async ensureDirectoryExists(path: string): Promise<void> {
    try {
      await mkdir(path, { recursive: true });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create directory ${path}: ${error.message}`);
      }
      throw error;
    }
  }

  protected async saveToJson(data: any, boardName: string, type: string, customFilename: string | null = null): Promise<void> {
    try {
      // Create directory structure
      const jobTitleDir = join(this.baseDir, boardName, this.jobTitle.toLowerCase().replace(/\s+/g, '_'));
      const typeDir = join(jobTitleDir, type);
      
      await this.ensureDirectoryExists(typeDir);

      // Generate filename
      let filename: string;
      if (customFilename) {
        filename = join(typeDir, `${customFilename}.json`);
      } else {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        filename = join(typeDir, `${type}_${timestamp}.json`);
      }

      // Save the data
      await writeFile(filename, JSON.stringify(data, null, 2), 'utf8');
      console.log(`Data saved to ${filename}`);
    } catch (e) {
      console.error(`Error saving to ${type} directory:`, e);
    }
  }

  protected cleanGroqResponse(text: string): any {
    // Remove markdown code block markers if present
    text = text.replace(/```json\s*/g, '');
    text = text.replace(/```\s*$/g, '');
    
    // Find the first { and last }
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}') + 1;
    
    if (jsonStart >= 0 && jsonEnd > jsonStart) {
      const jsonStr = text.slice(jsonStart, jsonEnd);
      try {
        return JSON.parse(jsonStr);
      } catch (e) {
        console.error(`JSON decode error: ${e}`);
        console.error(`Problematic JSON string: ${jsonStr}`);
        return { error: `JSON decode error: ${e.message}` };
      }
    }
    return { error: "No JSON object found in response" };
  }

  protected async parseJobDescription(text: string): Promise<any> {
    if (!text) {
      return { error: "Empty description" };
    }

    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`
    };

    const prompt = `Analyze the following job description and create a structured JSON representation of the key information. 
Organize the information in a way that makes sense for this specific job posting.
Focus on extracting the most important details that would help a candidate understand the role and requirements.

Here's the job description:
${text}

Return a JSON object with your analysis. Do not include any markdown formatting or additional text.`;

    const data = {
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [{
        role: "user",
        content: prompt
      }],
      temperature: 0.1,
      max_tokens: 2000
    };

    try {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: 'POST',
          headers,
          body: JSON.stringify(data)
        }
      );

      if (!response.ok) {
        return { error: `API error: ${response.status}` };
      }

      const result = await response.json() as GroqResponse;
      if (!result.choices || !result.choices.length) {
        return { error: "No choices in API response" };
      }

      const parsedText = result.choices[0].message.content;
      console.log("\nRaw Groq Response:");
      console.log("-".repeat(50));
      console.log(parsedText);
      console.log("-".repeat(50));

      return this.cleanGroqResponse(parsedText);

    } catch (e) {
      return { error: `Request failed: ${e.message}` };
    }
  }

  protected getJobDirectory(jobId: string): string {
    return join(this.baseDir, jobId);
  }

  protected parseJSON<T>(jsonStr: string): T | { error: string } {
    try {
      return JSON.parse(jsonStr) as T;
    } catch (error) {
      if (error instanceof Error) {
        console.error(`JSON decode error: ${error.message}`);
        console.error(`Problematic JSON string: ${jsonStr}`);
        return { error: `JSON decode error: ${error.message}` };
      }
      return { error: 'Unknown JSON parsing error' };
    }
  }

  protected async handleError(error: unknown): Promise<never> {
    if (error instanceof Error) {
      throw new Error(`Operation failed: ${error.message}`);
    }
    throw new Error('An unknown error occurred');
  }
} 