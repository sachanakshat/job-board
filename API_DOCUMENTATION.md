# Job Board API Documentation

## Overview

This API provides endpoints for job scraping, company research, and job management. The backend is built with Flask and supports both job-related operations and AI-powered company research using multiple providers (GROQ and Gemini).

**Base URL:** `http://localhost:5001`

## Table of Contents

1. [Job Management APIs](#job-management-apis)
2. [Company Research APIs](#company-research-apis)
3. [Provider Information APIs](#provider-information-apis)
4. [Error Handling](#error-handling)
5. [Authentication](#authentication)

---

## Job Management APIs

### 1. Push Jobs to MongoDB

**Endpoint:** `POST /api/push`

**Description:** Pushes processed job data from JSON files to MongoDB database.

**Request Body:** None (reads from artifacts directory)

**Response:**
```json
{
  "status": "success",
  "message": "Jobs pushed to MongoDB successfully",
  "stats": {
    "total_jobs_processed": 150,
    "jobs_updated": 45,
    "new_jobs_added": 105,
    "errors": 0
  },
  "error_details": [] // Only present if there are errors
}
```

**Sample cURL:**
```bash
curl -X POST http://localhost:5001/api/push \
  -H "Content-Type: application/json"
```

**Error Response:**
```json
{
  "status": "error",
  "message": "No processed jobs found"
}
```

---

### 2. Start Job Scraping

**Endpoint:** `POST /api/scrape`

**Description:** Initiates the job scraping process for specified job types.

**Request Body:**
```json
{
  "job_type": "devops_engineer",
  "limit": 10,
  "cookies": "optional_cookies_string"
}
```

**Parameters:**
- `job_type` (string, optional): Type of job to scrape (default: "devops_engineer")
- `limit` (integer, optional): Number of jobs to scrape (default: 3)
- `cookies` (string, optional): Browser cookies for authentication

**Response:**
```json
{
  "status": "success",
  "message": "Scraping completed successfully",
  "jobs_scraped": 10,
  "files_created": ["artifacts/2024-01-15/devops_engineer_processed_jobs.json"]
}
```

**Sample cURL:**
```bash
curl -X POST http://localhost:5001/api/scrape \
  -H "Content-Type: application/json" \
  -d '{
    "job_type": "software_engineer",
    "limit": 20
  }'
```

---

### 3. Get Jobs from MongoDB

**Endpoint:** `GET /api/jobs`

**Description:** Retrieves jobs from MongoDB with pagination support.

**Query Parameters:**
- `limit` (integer, optional): Number of jobs to return (default: 50, max: 100)
- `skip` (integer, optional): Number of jobs to skip for pagination (default: 0)

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "job_url": "https://example.com/job/123",
      "position": "Senior DevOps Engineer",
      "company": "Tech Corp",
      "location": "San Francisco, CA",
      "salary": "$120,000 - $150,000",
      "tags": ["AWS", "Docker", "Kubernetes"],
      "posted": "2024-01-15",
      "description": "Job description...",
      "job_id": "job_123",
      "parsed_description": "Parsed job details...",
      "views": 150,
      "applicants": 25,
      "apply_percentage": 16.7
    }
  ],
  "pagination": {
    "total": 1250,
    "limit": 50,
    "skip": 0,
    "has_more": true
  }
}
```

**Sample cURL:**
```bash
# Get first 20 jobs
curl "http://localhost:5001/api/jobs?limit=20&skip=0"

# Get next page
curl "http://localhost:5001/api/jobs?limit=20&skip=20"
```

---

## Company Research APIs

### 4. Get Company Information (General)

**Endpoint:** `POST /api/company-info`

**Description:** General endpoint for company research with configurable providers.

**Request Body:**
```json
{
  "company_name": "Google",
  "company_location": "Mountain View, CA",
  "research_type": "comprehensive",
  "search_provider": "groq",
  "llm_provider": "groq"
}
```

**Parameters:**
- `company_name` (string, required): Name of the company
- `company_location` (string, required): Location of the company
- `research_type` (string, optional): "quick" or "comprehensive" (default: "quick")
- `search_provider` (string, optional): "groq" or "playwright" (default: "groq")
- `llm_provider` (string, optional): "groq" or "gemini" (default: "groq")

**Response (Quick Research):**
```json
{
  "status": "success",
  "company_name": "Google",
  "company_location": "Mountain View, CA",
  "information": "Google is a multinational technology company...",
  "search_results_used": true,
  "research_method": "GROQ LLM with GROQ search and Playwright fallback",
  "search_results": "Raw search content...",
  "urls": ["https://example.com/google", "https://example.com/google-info"]
}
```

**Response (Comprehensive Research):**
```json
{
  "status": "success",
  "company_name": "Google",
  "company_location": "Mountain View, CA",
  "research_method": "GROQ LLM with GROQ search and Playwright fallback",
  "last_updated": "2024-01-15 14:30:25",
  "sections": {
    "Company Overview": {
      "content": "Google is a multinational technology company...",
      "sources": ["https://example.com/google-overview"]
    },
    "Founders and Leadership": {
      "content": "Founded by Larry Page and Sergey Brin...",
      "sources": ["https://example.com/google-founders"]
    }
  },
  "all_sources": ["https://example.com/google-overview", "https://example.com/google-founders"],
  "summary": {
    "total_sections": 8,
    "sections_with_data": 7,
    "total_sources": 12
  }
}
```

**Sample cURL:**
```bash
curl -X POST http://localhost:5001/api/company-info \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "Microsoft",
    "company_location": "Redmond, WA",
    "research_type": "comprehensive",
    "search_provider": "playwright",
    "llm_provider": "groq"
  }'
```

---

### 5. Get Quick Company Information

**Endpoint:** `POST /api/company-info/quick`

**Description:** Fast company research with basic information.

**Request Body:**
```json
{
  "company_name": "Apple",
  "company_location": "Cupertino, CA",
  "search_provider": "groq",
  "llm_provider": "groq"
}
```

**Response:**
```json
{
  "status": "success",
  "company_name": "Apple",
  "company_location": "Cupertino, CA",
  "information": "Apple Inc. is an American multinational technology company...",
  "search_results_used": true,
  "research_method": "GROQ LLM with GROQ search and Playwright fallback",
  "search_results": "Raw search content...",
  "urls": ["https://example.com/apple", "https://example.com/apple-info"]
}
```

**Sample cURL:**
```bash
curl -X POST http://localhost:5001/api/company-info/quick \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "Tesla",
    "company_location": "Austin, TX",
    "search_provider": "playwright",
    "llm_provider": "groq"
  }'
```

---

### 6. Get Comprehensive Company Information

**Endpoint:** `POST /api/company-info/comprehensive`

**Description:** Detailed company research with structured sections and sources.

**Request Body:**
```json
{
  "company_name": "Netflix",
  "company_location": "Los Gatos, CA",
  "search_provider": "groq",
  "llm_provider": "groq"
}
```

**Response:**
```json
{
  "status": "success",
  "company_name": "Netflix",
  "company_location": "Los Gatos, CA",
  "research_method": "GROQ LLM with GROQ search and Playwright fallback",
  "last_updated": "2024-01-15 14:30:25",
  "sections": {
    "Company Overview": {
      "content": "Netflix is a global streaming entertainment service...",
      "sources": ["https://example.com/netflix-overview"]
    },
    "Business Model": {
      "content": "Netflix operates on a subscription-based model...",
      "sources": ["https://example.com/netflix-business"]
    },
    "Technology Stack": {
      "content": "Netflix uses microservices architecture...",
      "sources": ["https://example.com/netflix-tech"]
    },
    "Market Position": {
      "content": "Netflix is a leading streaming platform...",
      "sources": ["https://example.com/netflix-market"]
    },
    "Recent Developments": {
      "content": "Recent developments include...",
      "sources": ["https://example.com/netflix-news"]
    }
  },
  "all_sources": [
    "https://example.com/netflix-overview",
    "https://example.com/netflix-business",
    "https://example.com/netflix-tech",
    "https://example.com/netflix-market",
    "https://example.com/netflix-news"
  ],
  "summary": {
    "total_sections": 5,
    "sections_with_data": 5,
    "total_sources": 5
  }
}
```

**Sample cURL:**
```bash
curl -X POST http://localhost:5001/api/company-info/comprehensive \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "Amazon",
    "company_location": "Seattle, WA",
    "search_provider": "playwright",
    "llm_provider": "gemini"
  }'
```

---

### 7. Get Structured Company Information

**Endpoint:** `POST /api/company-info/structured`

**Description:** Structured company research with JSON format and source links.

**Request Body:**
```json
{
  "company_name": "Meta",
  "company_location": "Menlo Park, CA",
  "search_provider": "groq",
  "llm_provider": "groq"
}
```

**Response:** Same format as comprehensive research with structured JSON.

**Sample cURL:**
```bash
curl -X POST http://localhost:5001/api/company-info/structured \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "Twitter",
    "company_location": "San Francisco, CA",
    "search_provider": "groq",
    "llm_provider": "groq"
  }'
```

---

## Provider Information APIs

### 8. Get Available Providers

**Endpoint:** `GET /api/providers`

**Description:** Returns available search and LLM providers.

**Response:**
```json
{
  "status": "success",
  "providers": {
    "search_providers": ["groq", "playwright"],
    "llm_providers": ["groq", "gemini"]
  }
}
```

**Sample cURL:**
```bash
curl http://localhost:5001/api/providers
```

---

## Error Handling

All API endpoints return consistent error responses:

### Standard Error Format
```json
{
  "status": "error",
  "message": "Detailed error description"
}
```

### Common HTTP Status Codes
- `200`: Success
- `400`: Bad Request (missing required parameters)
- `404`: Not Found (no data available)
- `500`: Internal Server Error

### Example Error Responses

**Missing Required Parameters:**
```json
{
  "status": "error",
  "message": "Both company_name and company_location are required"
}
```

**Provider Not Available:**
```json
{
  "status": "error",
  "message": "Invalid provider: 'invalid_provider'. Available providers: ['groq', 'gemini']"
}
```

**Service Unavailable:**
```json
{
  "status": "error",
  "message": "Failed to connect to the research service"
}
```

---

## Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible.

---

## Rate Limiting

- **GROQ API**: Subject to GROQ's rate limits
- **Gemini API**: Subject to Google's rate limits
- **Web Scraping**: Includes delays to respect website policies

---

## Environment Variables

The following environment variables are required:

```bash
# MongoDB Connection
MONGODB_CONNECTION_STRING=mongodb://localhost:27017/job_board

# GROQ API
GROQ_API_KEY=your_groq_api_key

# Gemini API
GOOGLE_API_KEY=your_google_api_key
```

---

## Usage Examples

### Complete Workflow Example

1. **Start scraping jobs:**
```bash
curl -X POST http://localhost:5001/api/scrape \
  -H "Content-Type: application/json" \
  -d '{"job_type": "devops_engineer", "limit": 50}'
```

2. **Push jobs to database:**
```bash
curl -X POST http://localhost:5001/api/push
```

3. **Get jobs with pagination:**
```bash
curl "http://localhost:5001/api/jobs?limit=20&skip=0"
```

4. **Research a company:**
```bash
curl -X POST http://localhost:5001/api/company-info/comprehensive \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "OpenAI",
    "company_location": "San Francisco, CA",
    "search_provider": "groq",
    "llm_provider": "groq"
  }'
```

### Testing with Different Providers

**Using Gemini for search and GROQ for LLM:**
```bash
curl -X POST http://localhost:5001/api/company-info/comprehensive \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "SpaceX",
    "company_location": "Hawthorne, CA",
    "search_provider": "playwright",
    "llm_provider": "groq"
  }'
```

**Using Gemini for both search and LLM:**
```bash
curl -X POST http://localhost:5001/api/company-info/comprehensive \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "NVIDIA",
    "company_location": "Santa Clara, CA",
    "search_provider": "playwright",
    "llm_provider": "gemini"
  }'
```

---

## Notes

- The API supports CORS for frontend integration
- All timestamps are in UTC format
- Job URLs are used as unique identifiers in the database
- The company research includes fallback mechanisms for reliability
- Structured research provides the most comprehensive results with source links 