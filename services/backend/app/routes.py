from flask import Blueprint, request, jsonify
from .models.job import Job
from .queue.redis import get_redis_client
from .db.mongodb import get_mongodb_client
from datetime import datetime
import uuid

api = Blueprint('api', __name__, url_prefix='/api')

@api.route('/jobs', methods=['POST'])
def create_job():
    data = request.get_json()
    
    # Validate required fields
    if not data or 'url' not in data or 'board_type' not in data:
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Create job
    job_id = str(uuid.uuid4())
    job = Job(
        job_id=job_id,
        url=data['url'],
        board_type=data['board_type'],
        status='pending',
        created_at=datetime.utcnow()
    )
    
    # Store in MongoDB
    db = get_mongodb_client()
    db.jobs.insert_one(job.to_dict())
    
    # Add to Redis queue
    redis_client = get_redis_client()
    redis_client.hset(f'job:{job_id}', mapping=job.to_dict())
    
    return jsonify({
        'job_id': job_id,
        'status': 'pending'
    }), 200

@api.route('/jobs/<job_id>', methods=['GET'])
def get_job_status(job_id):
    # Try Redis first
    redis_client = get_redis_client()
    job_data = redis_client.hgetall(f'job:{job_id}')
    
    if not job_data:
        # Try MongoDB
        db = get_mongodb_client()
        job = db.jobs.find_one({'job_id': job_id})
        
        if not job:
            return jsonify({'error': 'Job not found'}), 404
        
        job_data = job
    
    return jsonify(job_data), 200

@api.route('/jobs', methods=['GET'])
def list_jobs():
    db = get_mongodb_client()
    jobs = list(db.jobs.find({}, {'_id': 0}))
    return jsonify(jobs), 200

@api.route('/jobs/<job_id>', methods=['DELETE'])
def delete_job(job_id):
    # Delete from MongoDB
    db = get_mongodb_client()
    result = db.jobs.delete_one({'job_id': job_id})
    
    if result.deleted_count == 0:
        return jsonify({'error': 'Job not found'}), 404
    
    # Delete from Redis
    redis_client = get_redis_client()
    redis_client.delete(f'job:{job_id}')
    
    return jsonify({'message': 'Job deleted successfully'}), 200

def register_routes(app):
    app.register_blueprint(api) 