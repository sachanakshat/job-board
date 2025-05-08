from flask import Flask, request, jsonify
from flask_cors import CORS
import uuid
from datetime import datetime
import redis
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from threading import Thread

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Initialize Redis
redis_client = redis.Redis(
    host=os.getenv("REDIS_HOST", "redis"),
    port=int(os.getenv("REDIS_PORT", 6379)),
    decode_responses=True
)

# Initialize MongoDB
mongo_client = MongoClient(os.getenv("MONGODB_URI", "mongodb://mongodb:27017"))
db = mongo_client.jobboard

def process_job(job_id: str, board: str, title: str, limit: int):
    try:
        # Update job status to processing
        redis_client.hset(f"job:{job_id}", "status", "processing")
        
        # Import job board class based on board
        board_module = __import__(f"job_boards.{board}.board", fromlist=["Board"])
        board_class = getattr(board_module, f"{board.capitalize()}Board")
        
        # Initialize job board
        board_instance = board_class(title)
        
        # Process jobs
        with board_instance.playwright() as playwright:
            jobs = board_instance.extract_job_listings(playwright)
            total_jobs = min(len(jobs), limit)
            
            for i, job in enumerate(jobs[:limit]):
                # Update progress
                progress = (i + 1) / total_jobs * 100
                redis_client.hset(f"job:{job_id}", "progress", progress)
                
                # Process job
                processed_job = board_instance.process_job(job, playwright)
                if processed_job:
                    # Store in MongoDB
                    db.jobs.insert_one({
                        "job_id": job_id,
                        "job_data": processed_job,
                        "created_at": datetime.utcnow()
                    })
        
        # Update job status to completed
        redis_client.hset(f"job:{job_id}", "status", "completed")
        redis_client.hset(f"job:{job_id}", "progress", 100)
        
    except Exception as e:
        # Update job status to failed
        redis_client.hset(f"job:{job_id}", "status", "failed")
        redis_client.hset(f"job:{job_id}", "error", str(e))

@app.route("/api/jobs", methods=["POST"])
def create_job():
    data = request.get_json()
    
    # Validate required fields
    if not data or 'board' not in data or 'title' not in data:
        return jsonify({"error": "Missing required fields"}), 400
    
    job_id = str(uuid.uuid4())
    limit = data.get('limit', 3)
    
    # Store job request in Redis
    job_data = {
        "board": data['board'],
        "title": data['title'],
        "limit": limit,
        "status": "pending",
        "created_at": datetime.utcnow().isoformat()
    }
    redis_client.hmset(f"job:{job_id}", job_data)
    
    # Start job processing in background
    thread = Thread(target=process_job, args=(job_id, data['board'], data['title'], limit))
    thread.daemon = True
    thread.start()
    
    return jsonify({
        "job_id": job_id,
        "status": "pending",
        "message": "Job created successfully"
    }), 200

@app.route("/api/jobs/<job_id>", methods=["GET"])
def get_job_status(job_id):
    # Get job data from Redis
    job_data = redis_client.hgetall(f"job:{job_id}")
    if not job_data:
        return jsonify({"error": "Job not found"}), 404
    
    # Get job result from MongoDB if completed
    result = None
    if job_data.get("status") == "completed":
        result = db.jobs.find_one({"job_id": job_id})
        if result:
            result.pop("_id", None)
    
    return jsonify({
        "job_id": job_id,
        "status": job_data.get("status", "unknown"),
        "progress": float(job_data.get("progress", 0)),
        "result": result,
        "error": job_data.get("error")
    }), 200

@app.route("/api/jobs", methods=["GET"])
def list_jobs():
    # Get all job IDs from Redis
    job_keys = redis_client.keys("job:*")
    jobs = []
    
    for key in job_keys:
        job_id = key.split(":")[1]
        job_data = redis_client.hgetall(key)
        
        # Get job result from MongoDB if completed
        result = None
        if job_data.get("status") == "completed":
            result = db.jobs.find_one({"job_id": job_id})
            if result:
                result.pop("_id", None)
        
        jobs.append({
            "job_id": job_id,
            "status": job_data.get("status", "unknown"),
            "progress": float(job_data.get("progress", 0)),
            "result": result,
            "error": job_data.get("error")
        })
    
    return jsonify(jobs), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000) 