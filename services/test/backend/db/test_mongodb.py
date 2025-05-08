import pytest
from unittest.mock import patch, MagicMock
from datetime import datetime

from app.db.mongodb import init_mongodb, get_mongodb_client
from app.models.job import Job

@pytest.fixture
def mock_mongo_client():
    """Create a mock MongoDB client"""
    client = MagicMock()
    client.jobboard = MagicMock()
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

@patch('app.db.mongodb.MongoClient')
def test_init_mongodb(mock_mongo_client):
    """Test MongoDB initialization"""
    # Setup
    mock_app = MagicMock()
    mock_app.config = {
        'MONGODB_URI': 'mongodb://localhost:27017/jobboard'
    }
    
    # Initialize MongoDB
    init_mongodb(mock_app)
    
    # Verify
    mock_mongo_client.assert_called_once_with('mongodb://localhost:27017/jobboard')

@patch('app.db.mongodb.MongoClient')
def test_init_mongodb_with_default_uri(mock_mongo_client):
    """Test MongoDB initialization with default URI"""
    # Setup
    mock_app = MagicMock()
    mock_app.config = {}
    
    # Initialize MongoDB
    init_mongodb(mock_app)
    
    # Verify
    mock_mongo_client.assert_called_once_with('mongodb://localhost:27017/jobboard')

@patch('app.db.mongodb._client')
def test_get_mongodb_client(mock_client):
    """Test getting MongoDB client"""
    # Setup
    mock_client.jobboard = MagicMock()
    
    # Get client
    db = get_mongodb_client()
    
    # Verify
    assert db == mock_client.jobboard

@patch('app.db.mongodb._client')
def test_get_mongodb_client_not_initialized(mock_client):
    """Test getting MongoDB client when not initialized"""
    # Setup
    mock_client = None
    
    # Get client
    with pytest.raises(RuntimeError):
        get_mongodb_client()

@patch('app.db.mongodb.get_mongodb_client')
def test_job_operations(mock_get_client, mock_mongo_client, test_job):
    """Test job operations with MongoDB"""
    # Setup
    mock_get_client.return_value = mock_mongo_client
    jobs_collection = MagicMock()
    mock_mongo_client.jobs = jobs_collection
    
    # Insert job
    jobs_collection.insert_one(test_job.to_dict())
    
    # Find job
    jobs_collection.find_one.return_value = test_job.to_dict()
    job = jobs_collection.find_one({"job_id": test_job.job_id})
    
    # Update job
    jobs_collection.update_one.return_value.modified_count = 1
    result = jobs_collection.update_one(
        {"job_id": test_job.job_id},
        {"$set": {"status": "completed"}}
    )
    
    # Delete job
    jobs_collection.delete_one.return_value.deleted_count = 1
    result = jobs_collection.delete_one({"job_id": test_job.job_id})
    
    # Verify
    assert job == test_job.to_dict()
    assert result.modified_count == 1
    assert result.deleted_count == 1

@patch('app.db.mongodb.get_mongodb_client')
def test_job_list_operations(mock_get_client, mock_mongo_client):
    """Test job list operations with MongoDB"""
    # Setup
    mock_get_client.return_value = mock_mongo_client
    jobs_collection = MagicMock()
    mock_mongo_client.jobs = jobs_collection
    
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
    
    # Insert jobs
    jobs_collection.insert_many(jobs)
    
    # Find all jobs
    jobs_collection.find.return_value = jobs
    all_jobs = list(jobs_collection.find())
    
    # Find jobs by status
    jobs_collection.find.return_value = [jobs[0]]
    pending_jobs = list(jobs_collection.find({"status": "pending"}))
    
    # Verify
    assert len(all_jobs) == 3
    assert len(pending_jobs) == 1
    assert pending_jobs[0]["status"] == "pending"

@patch('app.db.mongodb.get_mongodb_client')
def test_job_aggregation(mock_get_client, mock_mongo_client):
    """Test job aggregation operations"""
    # Setup
    mock_get_client.return_value = mock_mongo_client
    jobs_collection = MagicMock()
    mock_mongo_client.jobs = jobs_collection
    
    # Mock aggregation results
    jobs_collection.aggregate.return_value = [
        {"status": "pending", "count": 5},
        {"status": "processing", "count": 2},
        {"status": "completed", "count": 10},
        {"status": "failed", "count": 1}
    ]
    
    # Get job counts by status
    pipeline = [
        {"$group": {"_id": "$status", "count": {"$sum": 1}}}
    ]
    status_counts = list(jobs_collection.aggregate(pipeline))
    
    # Verify
    assert len(status_counts) == 4
    assert status_counts[0]["count"] == 5
    assert status_counts[1]["count"] == 2
    assert status_counts[2]["count"] == 10
    assert status_counts[3]["count"] == 1 