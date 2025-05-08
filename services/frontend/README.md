# Job Board Frontend Service

A Next.js-based frontend service that provides a modern web interface for the Job Board application.

## Overview

The frontend service is responsible for:
- Providing a user-friendly interface for job board operations
- Managing job scraping requests
- Displaying job listings and status
- Handling user interactions

## Architecture

```
frontend/
├── components/        # React components
├── pages/            # Next.js pages
├── public/           # Static assets
├── styles/           # CSS styles
├── lib/              # Utility functions
├── package.json      # Node.js dependencies
└── Dockerfile        # Container configuration
```

## Features

1. **Job Board Selection**
   - Dropdown menu for selecting job boards
   - Support for multiple job board types

2. **Job Search**
   - Search interface for job listings
   - Filtering and sorting options
   - Real-time search results

3. **Job Management**
   - Create new job scraping requests
   - View job status and progress
   - Delete completed jobs
   - List all jobs

4. **Responsive Design**
   - Mobile-friendly interface
   - Adaptive layouts
   - Modern UI components

## API Integration

### Backend API Calls

```typescript
// Create job
const createJob = async (data: JobRequest) => {
  const response = await fetch('/api/jobs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};

// Get job status
const getJobStatus = async (jobId: string) => {
  const response = await fetch(`/api/jobs/${jobId}`);
  return response.json();
};

// List jobs
const listJobs = async () => {
  const response = await fetch('/api/jobs');
  return response.json();
};

// Delete job
const deleteJob = async (jobId: string) => {
  const response = await fetch(`/api/jobs/${jobId}`, {
    method: 'DELETE'
  });
  return response.json();
};
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set environment variables:
```bash
export NEXT_PUBLIC_API_URL=http://localhost:5000
```

3. Run the development server:
```bash
npm run dev
```

## Development

### Running Tests
```bash
npm run test
```

### Code Style
- Follow ESLint configuration
- Use TypeScript for type safety
- Follow React best practices

### Component Structure
- Use functional components
- Implement proper error boundaries
- Follow atomic design principles

## Build and Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Performance Optimization

- Code splitting
- Image optimization
- Caching strategies
- Lazy loading
- Bundle analysis

## Security

- Input sanitization
- XSS protection
- CSRF protection
- Secure API communication

## Monitoring

- Error tracking
- Performance monitoring
- User analytics
- Error boundaries 