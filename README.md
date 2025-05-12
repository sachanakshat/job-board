# DevOps Job Board API

A Flask-based API for scraping and retrieving DevOps jobs from RemoteOK.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Install Playwright browsers:
```bash
playwright install chromium
```

3. Create a `.env` file with your GROQ API key:
```
GROQ_API_KEY=your_api_key_here
```

4. Run the application:
```bash
python app.py
```

The server will start on port 5001.

## API Endpoints

### 1. Get Latest Jobs
Retrieves the most recently scraped jobs.

```bash
curl -X GET http://localhost:5001/api/jobs
```

Response:
```json
{
  "status": "success",
  "data": [
    {
      "position": "Senior DevOps Engineer",
      "company": "Example Corp",
      "location": "Worldwide",
      "salary": "$120k - $150k",
      "tags": ["AWS", "Kubernetes", "Terraform"],
      "posted": "2024-03-20T10:00:00Z",
      "job_id": "123456",
      "job_url": "https://remoteok.com/remote-jobs/123456",
      "views": "1.2k",
      "parsed_description": {
        "requirements": [
          "5+ years of DevOps experience",
          "Strong AWS knowledge",
          "Kubernetes expertise"
        ]
      }
    }
  ],
  "run_directory": "artifacts/remoteok/devops_engineer/20240320_100000"
}
```

### 2. Scrape New Jobs
Triggers a new job scraping process.

```bash
curl --location 'http://localhost:5001/api/scrape' \
--header 'Content-Type: application/json' \
--data '{
    "job_type": "devops_engineer",
    "limit": 3,
    "cookies": "new_user=true; visit_count=1; logged_in_token=_299ee39711c88fbc0e11eed6; PHPSESSID=vit521t4r6aq2v91btq98ho0im; ref=sl; adShuffler=1"
  }'
```

Parameters:
- `job_type` (optional): One of "devops_engineer", "site_reliability_engineer", or "cloud_engineer". Defaults to "devops_engineer".
- `limit` (optional): Number of jobs to scrape (1-10). Defaults to 3.

Response:
```json
{
  "status": "success",
  "message": "Processed 3 jobs",
  "data": [
    // Array of job objects
  ],
  "run_directory": "artifacts/remoteok/devops_engineer/20240320_100000"
}
```

## Error Responses

All endpoints may return the following error responses:

```json
{
  "status": "error",
  "message": "Error message here"
}
```

Common error messages:
- "No jobs have been scraped yet"
- "No processed jobs found in the latest run"
- "Failed to scrape jobs"

## Data Storage

All scraped data is stored in the following structure:
```
artifacts/
└── remoteok/
    └── devops_engineer/
        └── YYYYMMDD_HHMMSS/  # Timestamp for each run
            ├── raw/          # Raw job listings
            │   └── job_listings.json
            └── parsed/       # Individual parsed jobs
                ├── job_123.json
                ├── job_456.json
                └── job_789.json
            └── processed_jobs.json  # Combined results




job-board/
├── app.py
├── src/
│   ├── __init__.py
│   ├── config/
│   │   ├── __init__.py
│   │   └── browser_config.py
│   ├── models/
│   │   └── __init__.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── job_processor.py
│   │   └── scraper.py
│   └── utils/
│       ├── __init__.py
│       └── human_behavior.py
``` 