import pytest
from unittest.mock import patch, MagicMock
from datetime import datetime
import json

from app.queue.redis import init_redis, get_redis_client
from app.models.job import Job

@pytest.fixture
def mock_redis_client():
    """Create a mock Redis client"""
    client = MagicMock()
    client.set = MagicMock()
    client.get = MagicMock()
    client.delete = MagicMock()
    client.exists = MagicMock()
    client.lpush = MagicMock()
    client.rpop = MagicMock()
    client.llen = MagicMock()
    return client

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

@patch('app.queue.redis.Redis')
def test_init_redis(mock_redis):
    """Test Redis initialization"""
    # Setup
    mock_app = MagicMock()
    mock_app.config = {
        'REDIS_HOST': 'localhost',
        'REDIS_PORT': 6379
    }
    
    # Initialize Redis
    init_redis(mock_app)
    
    # Verify
    mock_redis.assert_called_once_with(
        host='localhost',
        port=6379,
        decode_responses=True
    )

@patch('app.queue.redis.Redis')
def test_init_redis_with_default_config(mock_redis):
    """Test Redis initialization with default config"""
    # Setup
    mock_app = MagicMock()
    mock_app.config = {}
    
    # Initialize Redis
    init_redis(mock_app)
    
    # Verify
    mock_redis.assert_called_once_with(
        host='localhost',
        port=6379,
        decode_responses=True
    )

@patch('app.queue.redis._client')
def test_get_redis_client(mock_client):
    """Test getting Redis client"""
    # Setup
    mock_client = MagicMock()
    
    # Get client
    client = get_redis_client()
    
    # Verify
    assert client == mock_client

@patch('app.queue.redis._client')
def test_get_redis_client_not_initialized(mock_client):
    """Test getting Redis client when not initialized"""
    # Setup
    mock_client = None
    
    # Get client
    with pytest.raises(RuntimeError):
        get_redis_client()

@patch('app.queue.redis.get_redis_client')
def test_job_queue_operations(mock_get_client, mock_redis_client, test_job):
    """Test job queue operations"""
    # Setup
    mock_get_client.return_value = mock_redis_client
    
    # Add job to queue
    queue_key = "job_queue"
    job_data = test_job.to_dict()
    mock_redis_client.lpush(queue_key, json.dumps(job_data))
    
    # Get queue length
    mock_redis_client.llen.return_value = 1
    length = mock_redis_client.llen(queue_key)
    
    # Get job from queue
    mock_redis_client.rpop.return_value = json.dumps(job_data)
    result = mock_redis_client.rpop(queue_key)
    
    # Verify
    assert length == 1
    assert result == json.dumps(job_data)
    mock_redis_client.lpush.assert_called_once_with(queue_key, json.dumps(job_data))
    mock_redis_client.llen.assert_called_once_with(queue_key)
    mock_redis_client.rpop.assert_called_once_with(queue_key)

@patch('app.queue.redis.get_redis_client')
def test_job_status_operations(mock_get_client, mock_redis_client, test_job):
    """Test job status operations"""
    # Setup
    mock_get_client.return_value = mock_redis_client
    
    # Set job status
    status_key = f"job_status:{test_job.job_id}"
    mock_redis_client.set(status_key, "processing")
    
    # Get job status
    mock_redis_client.get.return_value = "processing"
    status = mock_redis_client.get(status_key)
    
    # Delete job status
    mock_redis_client.delete(status_key)
    
    # Verify
    assert status == "processing"
    mock_redis_client.set.assert_called_once_with(status_key, "processing")
    mock_redis_client.get.assert_called_once_with(status_key)
    mock_redis_client.delete.assert_called_once_with(status_key)

@patch('app.queue.redis.get_redis_client')
def test_job_exists_operation(mock_get_client, mock_redis_client, test_job):
    """Test job exists operation"""
    # Setup
    mock_get_client.return_value = mock_redis_client
    
    # Check if job exists
    status_key = f"job_status:{test_job.job_id}"
    mock_redis_client.exists.return_value = True
    exists = mock_redis_client.exists(status_key)
    
    # Verify
    assert exists is True
    mock_redis_client.exists.assert_called_once_with(status_key)

@patch('app.queue.redis.get_redis_client')
def test_job_batch_operations(mock_get_client, mock_redis_client):
    """Test job batch operations"""
    # Setup
    mock_get_client.return_value = mock_redis_client
    
    # Create test jobs
    jobs = [
        {
            "job_id": f"test-{i}",
            "url": f"https://example.com/job/{i}",
            "board_type": "indeed",
            "status": "pending",
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        }
        for i in range(3)
    ]
    
    # Add jobs to queue
    queue_key = "job_queue"
    for job in jobs:
        mock_redis_client.lpush(queue_key, json.dumps(job))
    
    # Get queue length
    mock_redis_client.llen.return_value = 3
    length = mock_redis_client.llen(queue_key)
    
    # Get all jobs from queue
    mock_redis_client.rpop.side_effect = [json.dumps(job) for job in jobs]
    results = []
    for _ in range(3):
        result = mock_redis_client.rpop(queue_key)
        results.append(json.loads(result))
    
    # Verify
    assert length == 3
    assert len(results) == 3
    assert mock_redis_client.lpush.call_count == 3
    assert mock_redis_client.llen.call_count == 1
    assert mock_redis_client.rpop.call_count == 3 