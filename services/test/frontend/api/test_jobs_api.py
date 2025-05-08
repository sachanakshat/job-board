import pytest
import requests
from playwright.sync_api import sync_playwright

# Test data
TEST_JOB = {
    "url": "https://example.com/job/123",
    "board_type": "indeed"
}

@pytest.fixture
def api_url():
    return "http://localhost:3000/api"

@pytest.fixture
def job_id(api_url):
    # Create a test job
    response = requests.post(f"{api_url}/jobs", json=TEST_JOB)
    assert response.status_code == 200
    data = response.json()
    return data["job_id"]

def test_create_job(api_url):
    """Test creating a new job"""
    response = requests.post(f"{api_url}/jobs", json=TEST_JOB)
    assert response.status_code == 200
    data = response.json()
    assert "job_id" in data
    assert "status" in data
    assert data["status"] == "pending"

def test_get_job_status(api_url, job_id):
    """Test getting job status"""
    response = requests.get(f"{api_url}/jobs/{job_id}")
    assert response.status_code == 200
    data = response.json()
    assert "job_id" in data
    assert "status" in data
    assert "created_at" in data
    assert "updated_at" in data

def test_list_jobs(api_url):
    """Test listing all jobs"""
    response = requests.get(f"{api_url}/jobs")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    if len(data) > 0:
        job = data[0]
        assert "job_id" in job
        assert "status" in job
        assert "created_at" in job
        assert "updated_at" in job

def test_delete_job(api_url, job_id):
    """Test deleting a job"""
    # Delete the job
    response = requests.delete(f"{api_url}/jobs/{job_id}")
    assert response.status_code == 200
    
    # Verify job is deleted
    response = requests.get(f"{api_url}/jobs/{job_id}")
    assert response.status_code == 404

def test_invalid_job_id(api_url):
    """Test getting status of non-existent job"""
    response = requests.get(f"{api_url}/jobs/invalid_id")
    assert response.status_code == 404

def test_invalid_job_data(api_url):
    """Test creating job with invalid data"""
    invalid_job = {"invalid": "data"}
    response = requests.post(f"{api_url}/jobs", json=invalid_job)
    assert response.status_code == 400

@pytest.mark.e2e
def test_job_creation_flow():
    """Test the complete job creation flow using Playwright"""
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        
        # Navigate to the jobs page
        page.goto("http://localhost:3000/jobs")
        
        # Fill in the job form
        page.fill('input[name="url"]', TEST_JOB["url"])
        page.select_option('select[name="board_type"]', TEST_JOB["board_type"])
        
        # Submit the form
        page.click('button[type="submit"]')
        
        # Wait for success message
        page.wait_for_selector('.success-message')
        
        # Verify job was created
        assert page.locator('.success-message').is_visible()
        
        # Get the job ID from the success message
        job_id = page.locator('.job-id').text_content()
        assert job_id is not None
        
        # Verify job status
        page.goto(f"http://localhost:3000/jobs/{job_id}")
        assert page.locator('.job-status').text_content() == "pending"
        
        browser.close()

@pytest.mark.e2e
def test_job_list_page():
    """Test the job list page using Playwright"""
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        
        # Navigate to the jobs page
        page.goto("http://localhost:3000/jobs")
        
        # Verify page title
        assert page.title() == "Jobs | Job Board Scraper"
        
        # Verify job list table
        assert page.locator('table').is_visible()
        
        # Verify table headers
        headers = page.locator('th').all_text_contents()
        assert "Job ID" in headers
        assert "Status" in headers
        assert "Created At" in headers
        
        browser.close() 