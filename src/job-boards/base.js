import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';

dotenv.config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;
if (!GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY environment variable is not set");
}

export class BaseBoard {
  constructor(jobTitle) {
    this.jobTitle = jobTitle;
    this.baseDir = join(process.cwd(), 'artifacts');
  }

  async ensureDirectoryExists(path) {
    if (!existsSync(path)) {
      await mkdir(path, { recursive: true });
    }
  }

  async saveToJson(data, boardName, type, customFilename = null) {
    try {
      // Create directory structure
      const jobTitleDir = join(this.baseDir, boardName, this.jobTitle.toLowerCase().replace(/\s+/g, '_'));
      const typeDir = join(jobTitleDir, type);
      
      await this.ensureDirectoryExists(typeDir);

      // Generate filename
      let filename;
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

  cleanGroqResponse(text) {
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

  async parseJobDescription(text) {
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

      const result = await response.json();
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
} 