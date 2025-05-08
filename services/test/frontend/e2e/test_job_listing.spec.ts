import { test, expect } from '@playwright/test';

test.describe('Job Listing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://frontend:3000');
  });

  test('should display job listings', async ({ page }) => {
    // Wait for job listings to load
    await page.waitForSelector('[data-testid="job-list"]');

    // Check if job cards are displayed
    const jobCards = await page.$$('[data-testid="job-card"]');
    expect(jobCards.length).toBeGreaterThan(0);
  });

  test('should filter jobs by search', async ({ page }) => {
    // Type in search box
    await page.fill('[data-testid="search-input"]', 'Software Engineer');

    // Wait for filtered results
    await page.waitForSelector('[data-testid="job-list"]');

    // Check if filtered results contain search term
    const jobTitles = await page.$$eval(
      '[data-testid="job-title"]',
      elements => elements.map(el => el.textContent)
    );

    jobTitles.forEach(title => {
      expect(title?.toLowerCase()).toContain('software engineer');
    });
  });

  test('should create new job scraping request', async ({ page }) => {
    // Click create job button
    await page.click('[data-testid="create-job-button"]');

    // Fill job form
    await page.fill('[data-testid="job-url-input"]', 'https://example.com/jobs');
    await page.selectOption('[data-testid="board-type-select"]', 'example');

    // Submit form
    await page.click('[data-testid="submit-job-button"]');

    // Wait for success message
    await page.waitForSelector('[data-testid="success-message"]');

    // Verify success message
    const successMessage = await page.textContent('[data-testid="success-message"]');
    expect(successMessage).toContain('Job created successfully');
  });

  test('should display job status', async ({ page }) => {
    // Create a job first
    await page.click('[data-testid="create-job-button"]');
    await page.fill('[data-testid="job-url-input"]', 'https://example.com/jobs');
    await page.selectOption('[data-testid="board-type-select"]', 'example');
    await page.click('[data-testid="submit-job-button"]');

    // Wait for job status to appear
    await page.waitForSelector('[data-testid="job-status"]');

    // Check status
    const status = await page.textContent('[data-testid="job-status"]');
    expect(status).toMatch(/pending|processing|completed|failed/);
  });

  test('should handle job deletion', async ({ page }) => {
    // Create a job first
    await page.click('[data-testid="create-job-button"]');
    await page.fill('[data-testid="job-url-input"]', 'https://example.com/jobs');
    await page.selectOption('[data-testid="board-type-select"]', 'example');
    await page.click('[data-testid="submit-job-button"]');

    // Wait for job to appear in list
    await page.waitForSelector('[data-testid="job-card"]');

    // Get initial job count
    const initialCount = await page.$$eval(
      '[data-testid="job-card"]',
      cards => cards.length
    );

    // Delete the job
    await page.click('[data-testid="delete-job-button"]');
    await page.click('[data-testid="confirm-delete-button"]');

    // Wait for job to be removed
    await page.waitForTimeout(1000);

    // Get new job count
    const newCount = await page.$$eval(
      '[data-testid="job-card"]',
      cards => cards.length
    );

    expect(newCount).toBe(initialCount - 1);
  });
}); 