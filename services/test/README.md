# Test Service

## Overview
The Test Service is a comprehensive testing framework for the Job Board Scraper application. It provides a unified environment for running both frontend and backend tests, generating test reports, and maintaining test dashboards.

## Features
- Frontend test suite (Next.js)
- Backend test suite (Flask)
- Configurable test selection
- Test reporting and dashboards
- CI/CD integration support
- Parallel test execution
- Test data management

## Architecture
```
test/
├── frontend/           # Frontend test suite
│   ├── components/     # Component tests
│   ├── pages/         # Page tests
│   ├── api/           # API integration tests
│   └── utils/         # Test utilities
├── backend/           # Backend test suite
│   ├── api/           # API endpoint tests
│   ├── job_boards/    # Job board scraper tests
│   ├── queue/         # Queue management tests
│   └── utils/         # Test utilities
├── reports/           # Test reports and dashboards
├── requirements.txt   # Python dependencies
└── Dockerfile        # Test environment setup
```

## Test Suites

### Frontend Tests
- Component unit tests
- Page integration tests
- API integration tests
- End-to-end tests
- Performance tests
- Accessibility tests

### Backend Tests
- API endpoint tests
- Job board scraper tests
- Queue management tests
- Database integration tests
- Error handling tests
- Performance tests

## Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Set environment variables:
   ```bash
   export BACKEND_URL=http://localhost:5000
   export FRONTEND_URL=http://localhost:3000
   export TEST_TYPE=all  # or frontend/backend
   export TEST_REPORT_DIR=./reports
   ```

3. Run tests:
   ```bash
   # Run all tests
   pytest

   # Run specific test suite
   pytest frontend/
   pytest backend/

   # Run specific test file
   pytest frontend/api/test_jobs_api.py
   ```

## Test Reports
Test reports are generated in the `reports` directory and include:
- Test results summary
- Coverage reports
- Performance metrics
- Error logs
- Test dashboards

## Development

### Writing Tests
1. Follow the existing test structure
2. Use appropriate test fixtures
3. Write clear test descriptions
4. Include both positive and negative test cases
5. Mock external dependencies

### Test Data
- Use fixtures for test data
- Clean up test data after tests
- Use realistic test scenarios
- Maintain test data versioning

### Best Practices
1. Keep tests independent
2. Use meaningful test names
3. Follow AAA pattern (Arrange, Act, Assert)
4. Mock external services
5. Clean up resources
6. Handle async operations properly

## CI/CD Integration
The test service can be integrated with CI/CD pipelines:
```yaml
test:
  stage: test
  script:
    - pip install -r requirements.txt
    - pytest --junitxml=reports/junit.xml
  artifacts:
    reports:
      junit: reports/junit.xml
```

## Monitoring
- Test execution time
- Test coverage metrics
- Failed test trends
- Performance benchmarks
- Resource usage

## Security
- Secure test data handling
- Environment variable protection
- Access control for test reports
- Secure test execution environment

## Troubleshooting
1. Check test environment setup
2. Verify service connections
3. Review test logs
4. Check test data integrity
5. Verify test dependencies

## Contributing
1. Follow test writing guidelines
2. Update test documentation
3. Maintain test coverage
4. Add new test cases as needed
5. Review and update test data 