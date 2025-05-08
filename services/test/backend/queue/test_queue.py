import pytest
from unittest.mock import patch, MagicMock
from datetime import datetime
import json

from app.queue.redis import get_redis_client
from app.models.job import Job

@pytest.fixture
def mock_redis():
    """Create a mock Redis client"""
    redis = MagicMock()
    redis.set = MagicMock()
    redis.get = MagicMock()
    redis.delete = MagicMock()
    redis.exists = MagicMock()
    redis.lpush = MagicMock()
    redis.rpop = MagicMock()
    redis.llen = MagicMock()
    return redis

@pytest.fixture
def test_job():
    """Create a test job"""
    return Job(
        job_id="test-123",
        url="https://example.com/job/123",
        board_type="indeed",
        status="pending",
        created_at=datetime.now(),
        updated_at=datetime.now()
    )

@patch('app.queue.redis.get_redis_client')
def test_add_job_to_queue(mock_get_redis, mock_redis, test_job):
    """Test adding a job to the queue"""
    # Setup
    mock_get_redis.return_value = mock_redis
    
    # Add job to queue
    queue_key = "job_queue"
    job_data = test_job.to_dict()
    mock_redis.lpush(queue_key, json.dumps(job_data))
    
    # Verify
    mock_redis.lpush.assert_called_once_with(queue_key, json.dumps(job_data))

@patch('app.queue.redis.get_redis_client')
def test_get_job_from_queue(mock_get_redis, mock_redis, test_job):
    """Test getting a job from the queue"""
    # Setup
    mock_get_redis.return_value = mock_redis
    job_data = test_job.to_dict()
    mock_redis.rpop.return_value = json.dumps(job_data)
    
    # Get job from queue
    queue_key = "job_queue"
    result = mock_redis.rpop(queue_key)
    
    # Verify
    mock_redis.rpop.assert_called_once_with(queue_key)
    assert result == json.dumps(job_data)

@patch('app.queue.redis.get_redis_client')
def test_queue_length(mock_get_redis, mock_redis):
    """Test getting queue length"""
    # Setup
    mock_get_redis.return_value = mock_redis
    mock_redis.llen.return_value = 5
    
    # Get queue length
    queue_key = "job_queue"
    length = mock_redis.llen(queue_key)
    
    # Verify
    mock_redis.llen.assert_called_once_with(queue_key)
    assert length == 5

@patch('app.queue.redis.get_redis_client')
def test_update_job_status(mock_get_redis, mock_redis, test_job):
    """Test updating job status"""
    # Setup
    mock_get_redis.return_value = mock_redis
    
    # Update job status
    status_key = f"job_status:{test_job.job_id}"
    mock_redis.set(status_key, "processing")
    
    # Verify
    mock_redis.set.assert_called_once_with(status_key, "processing")

@patch('app.queue.redis.get_redis_client')
def test_get_job_status(mock_get_redis, mock_redis, test_job):
    """Test getting job status"""
    # Setup
    mock_get_redis.return_value = mock_redis
    mock_redis.get.return_value = "processing"
    
    # Get job status
    status_key = f"job_status:{test_job.job_id}"
    status = mock_redis.get(status_key)
    
    # Verify
    mock_redis.get.assert_called_once_with(status_key)
    assert status == "processing"

@patch('app.queue.redis.get_redis_client')
def test_delete_job(mock_get_redis, mock_redis, test_job):
    """Test deleting a job"""
    # Setup
    mock_get_redis.return_value = mock_redis
    
    # Delete job
    status_key = f"job_status:{test_job.job_id}"
    mock_redis.delete(status_key)
    
    # Verify
    mock_redis.delete.assert_called_once_with(status_key)

@patch('app.queue.redis.get_redis_client')
def test_job_exists(mock_get_redis, mock_redis, test_job):
    """Test checking if job exists"""
    # Setup
    mock_get_redis.return_value = mock_redis
    mock_redis.exists.return_value = True
    
    # Check if job exists
    status_key = f"job_status:{test_job.job_id}"
    exists = mock_redis.exists(status_key)
    
    # Verify
    mock_redis.exists.assert_called_once_with(status_key)
    assert exists is True

@patch('app.queue.redis.get_redis_client')
def test_queue_operations(mock_get_redis, mock_redis, test_job):
    """Test multiple queue operations"""
    # Setup
    mock_get_redis.return_value = mock_redis
    job_data = test_job.to_dict()
    
    # Add job to queue
    queue_key = "job_queue"
    mock_redis.lpush(queue_key, json.dumps(job_data))
    
    # Get queue length
    mock_redis.llen.return_value = 1
    length = mock_redis.llen(queue_key)
    
    # Get job from queue
    mock_redis.rpop.return_value = json.dumps(job_data)
    result = mock_redis.rpop(queue_key)
    
    # Verify
    assert length == 1
    assert result == json.dumps(job_data)
    assert mock_redis.lpush.call_count == 1
    assert mock_redis.llen.call_count == 1
    assert mock_redis.rpop.call_count == 1 