# API Quick Reference

**Base URL:** `http://localhost:5001`

## Job Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/push` | Push jobs to MongoDB |
| `POST` | `/api/scrape` | Start job scraping |
| `GET` | `/api/jobs` | Get jobs with pagination |

## Company Research

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/company-info` | General company research |
| `POST` | `/api/company-info/quick` | Quick company info |
| `POST` | `/api/company-info/comprehensive` | Comprehensive research |
| `POST` | `/api/company-info/structured` | Structured research |
| `GET` | `/api/providers` | Get available providers |

## Common Parameters

### Company Research Parameters
- `company_name` (required): Company name
- `company_location` (required): Company location
- `research_type`: "quick" or "comprehensive"
- `search_provider`: "groq" or "playwright"
- `llm_provider`: "groq" or "gemini"

### Job Scraping Parameters
- `job_type`: Type of job to scrape
- `limit`: Number of jobs to scrape
- `cookies`: Browser cookies (optional)

### Pagination Parameters
- `limit`: Number of items per page
- `skip`: Number of items to skip

## Quick Examples

### Research a Company
```bash
curl -X POST http://localhost:5001/api/company-info/comprehensive \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "Google",
    "company_location": "Mountain View, CA"
  }'
```

### Get Jobs
```bash
curl "http://localhost:5001/api/jobs?limit=20&skip=0"
```

### Get Available Providers
```bash
curl http://localhost:5001/api/providers
```

## Response Format

### Success Response
```json
{
  "status": "success",
  "data": {...}
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error description"
}
```

---

**Full Documentation:** See `API_DOCUMENTATION.md` for detailed examples and usage. 