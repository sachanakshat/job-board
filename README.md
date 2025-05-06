# Job Board Scraper

A Next.js application that scrapes job listings from various remote job boards and analyzes them using the Groq API.

## Features

- Scrape job listings from multiple job boards:
  - RemoteOK
  - We Work Remotely
  - WellFound
- Analyze job descriptions using Groq API
- Modern web interface for searching jobs
- Store results in organized directory structure

## Prerequisites

- Node.js 18+ and npm
- Groq API key

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd job-board
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Groq API key:
```
GROQ_API_KEY=your_groq_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Usage

1. Open the web interface at `http://localhost:3000`
2. Select a job board from the dropdown
3. Enter a job title to search for
4. Set the number of results to fetch (1-10)
5. Click "Search Jobs"

The application will:
1. Scrape job listings from the selected board
2. Process each job listing to extract full details
3. Analyze job descriptions using Groq API
4. Save results in the `artifacts` directory
5. Display results in the web interface

## Project Structure

```
job-board/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── page.tsx           # Main page
│   └── layout.tsx         # Root layout
├── lib/                   # Library code
│   └── job-boards/        # Job board implementations
├── artifacts/             # Scraped data storage
└── public/               # Static assets
```

## API Endpoints

### POST /api/jobs

Scrapes job listings based on the provided parameters.

Request body:
```json
{
  "board": "remoteok",
  "title": "DevOps Engineer",
  "limit": 3
}
```

Response:
```json
[
  {
    "jobId": "...",
    "position": "...",
    "company": "...",
    "location": "...",
    "salary": "...",
    "tags": [...],
    "posted": "...",
    "views": 0,
    "applicants": 0,
    "applyPercentage": 0,
    "jobUrl": "...",
    "description": "...",
    "parsedDescription": {...}
  }
]
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## License

MIT