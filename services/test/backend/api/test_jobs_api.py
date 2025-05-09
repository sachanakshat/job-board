import pytest
import requests
from datetime import datetime

# Test data
TEST_JOB = {
    "url": "https://example.com/job/123",
    "board_type": "indeed"
}

@pytest.fixture
def api_url():
    return "http://localhost:5000/api"

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

def test_job_status_transitions(api_url, job_id):
    """Test job status transitions"""
    # Get initial status
    response = requests.get(f"{api_url}/jobs/{job_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "pending"
    
    # Wait for processing (this would be handled by the backend)
    # For now, we'll just verify the initial state
    
    # Verify job data structure
    assert "job_id" in data
    assert "url" in data
    assert "board_type" in data
    assert "created_at" in data
    assert "updated_at" in data
    assert "result" in data 