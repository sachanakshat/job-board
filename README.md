# Job Board Scraper

A powerful job board scraper that extracts and analyzes job listings from multiple remote job boards. The application uses Playwright for web scraping and Groq API for intelligent job description analysis.

## Features

- Multi-board support:
  - RemoteOK
  - WeWorkRemotely
  - WellFound
- Intelligent job description analysis using Groq API
- Extracts key job details:
  - Job title, company, location
  - Salary information
  - Job tags
  - Posting time
  - View count
  - Number of applicants
  - Application percentage
- Structured data storage with search context
- Configurable job search parameters

## Project Structure

```
job-board/
├── artifacts/                    # Scraped data storage
│   ├── remoteok/                # RemoteOK board data
│   │   └── devops_engineer/     # Job title specific data
│   │       ├── metadata/        # Job metadata
│   │       ├── groq_responses/  # Groq API analysis
│   │       └── job_listings/    # Complete job listings
│   ├── weworkremotely/          # WeWorkRemotely board data
│   └── wellfound/               # WellFound board data
├── job_boards/                  # Job board implementations
│   ├── base.py                 # Base job board class
│   ├── remoteok/               # RemoteOK implementation
│   │   └── board.py
│   ├── weworkremotely/         # WeWorkRemotely implementation
│   │   └── board.py
│   └── wellfound/              # WellFound implementation
│       └── board.py
├── main.py                     # Main script
├── requirements.txt            # Python dependencies
└── .env                        # Environment variables
```

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd job-board
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Install Playwright browsers:
   ```bash
   playwright install
   ```

5. Create a `.env` file with your Groq API key:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   ```

## Usage

Run the script with the following options:

```bash
python main.py [--board BOARD] [--title TITLE] [--limit LIMIT]
```

Arguments:
- `--board`: Job board to scrape (choices: remoteok, weworkremotely, wellfound, default: remoteok)
- `--title`: Job title to search for (default: "DevOps Engineer")
- `--limit`: Number of jobs to process (default: 3)

Examples:
```bash
# Use default settings (RemoteOK, "DevOps Engineer", 3 jobs)
python main.py

# Search for Python jobs on WeWorkRemotely
python main.py --board weworkremotely --title "Python Developer"

# Process 5 jobs from WellFound
python main.py --board wellfound --title "Frontend Developer" --limit 5
```

## Data Structure

### Job Metadata
```json
{
  "job_id": "unique_id",
  "position": "Job Title",
  "company": "Company Name",
  "location": "Job Location",
  "salary": "Salary Range",
  "tags": ["tag1", "tag2"],
  "job_url": "Job Listing URL",
  "posted": "Posting Timestamp",
  "views": "View Count",
  "applicants": "Number of Applicants",
  "apply_percentage": "Application Percentage",
  "description_length": 1234,
  "search_context": {
    "job_board": "board_name",
    "job_title": "search_title",
    "search_url": "search_url",
    "timestamp": "search_timestamp"
  }
}
```

### Groq API Analysis
The Groq API analyzes job descriptions and returns structured data including:
- Job title and company information
- Job description and responsibilities
- Requirements and qualifications
- Benefits and compensation
- Company information and culture
- Application instructions

## Implementation Details

### BaseJobBoard Class
- Abstract base class defining common functionality
- Handles artifact directory creation and management
- Implements Groq API integration for job description analysis
- Provides methods for saving metadata, Groq responses, and job listings

### Board-Specific Implementations
Each job board implementation:
- Extends BaseJobBoard
- Implements board-specific URL generation
- Defines custom selectors for job listings
- Handles board-specific job detail extraction
- Maintains consistent data structure across boards

### Data Storage
- Organized by job board and job title
- Separate directories for metadata, Groq responses, and job listings
- Timestamped files for tracking data history
- Search context included in all saved data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 