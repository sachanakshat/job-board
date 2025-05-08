# Job Board Backend Service

A Flask-based microservice that handles job board scraping, processing, and data management.

## Overview

The backend service is responsible for:
- Scraping job listings from various job boards
- Processing and storing job data
- Managing job status and queue
- Providing REST API endpoints

## Architecture

```
backend/
├── app/
│   ├── job_boards/     # Job board scrapers
│   ├── queue/          # Queue management
│   ├── db/            # Database models and connections
│   ├── models/        # Data models
│   └── utils/         # Utility functions
├── tests/             # Test suite
├── requirements.txt   # Python dependencies
└── Dockerfile        # Container configuration
```

## API Endpoints

### Job Management

#### Create Job
```http
POST /api/jobs
Content-Type: application/json

{
  "url": "https://example.com/jobs",
  "board_type": "example"
}
```

Response:
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "pending"
}
```

#### Get Job Status
```http
GET /api/jobs/{job_id}
```

Response:
```json
{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "completed",
  "created_at": "2024-03-19T12:00:00Z",
  "updated_at": "2024-03-19T12:01:00Z"
}
```

#### List Jobs
```http
GET /api/jobs
```

Response:
```json
[
  {
    "job_id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "completed",
    "created_at": "2024-03-19T12:00:00Z"
  }
]
```

#### Delete Job
```http
DELETE /api/jobs/{job_id}
```

Response:
```json
{
  "message": "Job deleted successfully"
}
```

## Job States

1. `pending`: Job created, waiting to be processed
2. `processing`: Job is being scraped and analyzed
3. `completed`: Job processing finished successfully
4. `failed`: Job processing encountered an error

## Dependencies

- Flask: Web framework
- Redis: Queue management
- MongoDB: Data storage
- Playwright: Web scraping
- Pydantic: Data validation

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set environment variables:
```bash
export FLASK_APP=app
export FLASK_ENV=development
export REDIS_HOST=redis
export REDIS_PORT=6379
export MONGODB_URI=mongodb://mongodb:27017/jobboard
```

3. Run the service:
```bash
flask run
```

## Development

### Running Tests
```bash
pytest
```

### Code Style
- Follow PEP 8 guidelines
- Use type hints
- Write docstrings for functions and classes

### Error Handling
- Use proper HTTP status codes
- Return descriptive error messages
- Log errors appropriately

## Monitoring

- Service health checks
- Job processing metrics
- Error rate tracking
- Performance monitoring

## Security

- Input validation
- Rate limiting
- CORS protection
- Secure service communication 