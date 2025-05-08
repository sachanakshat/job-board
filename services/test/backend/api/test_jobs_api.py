import pytest
import requests
import json
from datetime import datetime

BASE_URL = "http://backend:5000/api"

@pytest.mark.api
@pytest.mark.backend
class TestJobsAPI:
    def test_create_job(self):
        """Test creating a new job"""
        response = requests.post(
            f"{BASE_URL}/jobs",
            json={
                "url": "https://example.com/jobs",
                "board_type": "example"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert "job_id" in data
        assert "status" in data
        assert data["status"] == "pending"

    def test_get_job_status(self):
        """Test getting job status"""
        # First create a job
        create_response = requests.post(
            f"{BASE_URL}/jobs",
            json={
                "url": "https://example.com/jobs",
                "board_type": "example"
            }
        )
        job_id = create_response.json()["job_id"]

        # Then get its status
        response = requests.get(f"{BASE_URL}/jobs/{job_id}")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        assert "created_at" in data

    def test_list_jobs(self):
        """Test listing all jobs"""
        response = requests.get(f"{BASE_URL}/jobs")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        if len(data) > 0:
            assert "job_id" in data[0]
            assert "status" in data[0]
            assert "created_at" in data[0]

    def test_delete_job(self):
        """Test deleting a job"""
        # First create a job
        create_response = requests.post(
            f"{BASE_URL}/jobs",
            json={
                "url": "https://example.com/jobs",
                "board_type": "example"
            }
        )
        job_id = create_response.json()["job_id"]

        # Then delete it
        response = requests.delete(f"{BASE_URL}/jobs/{job_id}")
        assert response.status_code == 200

        # Verify it's deleted
        get_response = requests.get(f"{BASE_URL}/jobs/{job_id}")
        assert get_response.status_code == 404

    def test_invalid_job_id(self):
        """Test getting status of non-existent job"""
        response = requests.get(f"{BASE_URL}/jobs/invalid-id")
        assert response.status_code == 404

    def test_invalid_job_data(self):
        """Test creating job with invalid data"""
        response = requests.post(
            f"{BASE_URL}/jobs",
            json={
                "invalid_field": "value"
            }
        )
        assert response.status_code == 400 