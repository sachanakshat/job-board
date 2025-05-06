# Job Board Scraper

A Node.js application that scrapes job listings from various remote job boards and analyzes them using the Groq API.

## Features

- Scrapes job listings from multiple job boards:
  - RemoteOK
  - WeWorkRemotely
  - WellFound
- Extracts detailed job information including:
  - Job title
  - Company name
  - Location
  - Salary (if available)
  - Tags
  - Full job description
  - Application statistics
- Uses Groq API to analyze and structure job descriptions
- Saves results in organized directories:
  - Complete job listings
  - Individual GROQ responses
  - Combined GROQ responses
  - Job metadata

## Prerequisites

- Node.js 18 or higher
- npm (Node Package Manager)
- A Groq API key

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd job-board-scraper
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browser:
```bash
npx playwright install chromium
```

4. Create a `.env` file in the root directory and add your Groq API key:
```
GROQ_API_KEY=your_groq_api_key_here
```

## Usage

Run the scraper with default settings (RemoteOK board, DevOps Engineer search):
```bash
npm start
```

Or specify options:
```bash
npm start -- --board remoteok --title "DevOps Engineer" --limit 3
```

Available options:
- `--board`: Job board to scrape (remoteok, weworkremotely, wellfound)
- `--title`: Job title to search for
- `--limit`: Number of jobs to process

## Project Structure

```
job-board-scraper/
├── src/
│   ├── main.js                 # Main entry point
│   └── job-boards/
│       ├── base.js            # Base board class
│       ├── remoteok/
│       │   └── board.js       # RemoteOK implementation
│       ├── weworkremotely/
│       │   └── board.js       # WeWorkRemotely implementation
│       └── wellfound/
│           └── board.js       # WellFound implementation
├── artifacts/                  # Scraped data storage
│   └── <board_name>/
│       └── <job_title>/
│           ├── job_listings/  # Complete job listings
│           ├── groq_responses/ # AI analysis responses
│           └── metadata/      # Job metadata
├── package.json
├── .env
└── README.md
```

## Output Structure

The scraper organizes the output data in the following structure:

```
artifacts/
└── <board_name>/
    └── <job_title>/
        ├── job_listings/
        │   └── job_listings_<timestamp>.json     # Complete job details
        ├── groq_responses/
        │   ├── groq_response_<jobId>.json       # Individual GROQ responses
        │   └── all_groq_responses.json          # Combined GROQ responses
        └── metadata/
            └── metadata_<timestamp>.json         # Job metadata
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 