# Job Board Test Suite

This service contains comprehensive test suites for both frontend and backend components of the Job Board application.

## Test Structure

```
test/
├── frontend/
│   ├── unit/         # Unit tests for frontend components
│   ├── integration/  # Integration tests for frontend features
│   └── e2e/          # End-to-end tests using Playwright
├── backend/
│   ├── unit/         # Unit tests for backend components
│   ├── integration/  # Integration tests for backend features
│   └── api/          # API tests
└── reports/          # Test reports and coverage information
```

## Running Tests

### Frontend Tests

```bash
# Run all frontend tests
npm run test:frontend

# Run specific test file
npm run test:frontend -- path/to/test.spec.ts

# Run tests with specific tag
npm run test:frontend -- --grep "tag"
```

### Backend Tests

```bash
# Run all backend tests
npm run test:backend

# Run specific test file
npm run test:backend -- path/to/test_file.py

# Run tests with specific marker
npm run test:backend -- -m "api"
```

### All Tests

```bash
# Run both frontend and backend tests
npm run test:all
```

## Test Reports

Test reports are generated in the `reports` directory:

- HTML reports: `reports/report.html`
- Coverage reports: `reports/coverage`
- Playwright reports: `reports/playwright-report`
- JUnit reports: `reports/junit.xml`
- Allure reports: `reports/allure-results`

To view the Playwright report:

```bash
npm run test:report
```

## Configuration

### Frontend Tests

- Configuration: `playwright.config.ts`
- TypeScript config: `tsconfig.json`

### Backend Tests

- Configuration: `pytest.ini`
- Requirements: `requirements.txt`

## Environment Variables

- `BACKEND_URL`: Backend service URL (default: http://backend:5000)
- `FRONTEND_URL`: Frontend service URL (default: http://frontend:3000)
- `TEST_TYPE`: Type of tests to run (frontend/backend/all)
- `TEST_REPORT_DIR`: Directory for test reports

## Adding New Tests

1. Frontend Tests:
   - Place unit tests in `frontend/unit/`
   - Place integration tests in `frontend/integration/`
   - Place E2E tests in `frontend/e2e/`

2. Backend Tests:
   - Place unit tests in `backend/unit/`
   - Place integration tests in `backend/integration/`
   - Place API tests in `backend/api/`

## Best Practices

1. Use appropriate test markers
2. Write descriptive test names
3. Include proper assertions
4. Handle async operations correctly
5. Clean up test data after tests
6. Use test fixtures when appropriate
7. Follow the AAA pattern (Arrange, Act, Assert) 