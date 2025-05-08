from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import uuid
import json
from datetime import datetime
import redis
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="Job Board Scraper API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Redis
redis_client = redis.Redis(
    host=os.getenv("REDIS_HOST", "redis"),
    port=int(os.getenv("REDIS_PORT", 6379)),
    decode_responses=True
)

# Initialize MongoDB
mongo_client = AsyncIOMotorClient(os.getenv("MONGODB_URI", "mongodb://mongodb:27017"))
db = mongo_client.jobboard

# Models
class JobRequest(BaseModel):
    board: str
    title: str
    limit: Optional[int] = 3

class JobResponse(BaseModel):
    job_id: str
    status: str
    message: str

class JobStatus(BaseModel):
    job_id: str
    status: str
    progress: Optional[float] = 0
    result: Optional[dict] = None
    error: Optional[str] = None

# Routes
@app.post("/api/jobs", response_model=JobResponse)
async def create_job(request: JobRequest, background_tasks: BackgroundTasks):
    job_id = str(uuid.uuid4())
    
    # Store job request in Redis
    job_data = {
        "board": request.board,
        "title": request.title,
        "limit": request.limit,
        "status": "pending",
        "created_at": datetime.utcnow().isoformat()
    }
    redis_client.hmset(f"job:{job_id}", job_data)
    
    # Add job to processing queue
    background_tasks.add_task(process_job, job_id, request)
    
    return JobResponse(
        job_id=job_id,
        status="pending",
        message="Job created successfully"
    )

@app.get("/api/jobs/{job_id}", response_model=JobStatus)
async def get_job_status(job_id: str):
    # Get job data from Redis
    job_data = redis_client.hgetall(f"job:{job_id}")
    if not job_data:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Get job result from MongoDB if completed
    result = None
    if job_data.get("status") == "completed":
        result = await db.jobs.find_one({"job_id": job_id})
        if result:
            result.pop("_id", None)
    
    return JobStatus(
        job_id=job_id,
        status=job_data.get("status", "unknown"),
        progress=float(job_data.get("progress", 0)),
        result=result,
        error=job_data.get("error")
    )

@app.get("/api/jobs", response_model=List[JobStatus])
async def list_jobs():
    # Get all job IDs from Redis
    job_keys = redis_client.keys("job:*")
    jobs = []
    
    for key in job_keys:
        job_id = key.split(":")[1]
        job_data = redis_client.hgetall(key)
        
        # Get job result from MongoDB if completed
        result = None
        if job_data.get("status") == "completed":
            result = await db.jobs.find_one({"job_id": job_id})
            if result:
                result.pop("_id", None)
        
        jobs.append(JobStatus(
            job_id=job_id,
            status=job_data.get("status", "unknown"),
            progress=float(job_data.get("progress", 0)),
            result=result,
            error=job_data.get("error")
        ))
    
    return jobs

async def process_job(job_id: str, request: JobRequest):
    try:
        # Update job status to processing
        redis_client.hset(f"job:{job_id}", "status", "processing")
        
        # Import job board class based on request.board
        board_module = __import__(f"job_boards.{request.board}.board", fromlist=["Board"])
        board_class = getattr(board_module, f"{request.board.capitalize()}Board")
        
        # Initialize job board
        board = board_class(request.title)
        
        # Process jobs
        async with board.playwright() as playwright:
            jobs = await board.extract_job_listings(playwright)
            total_jobs = min(len(jobs), request.limit)
            
            for i, job in enumerate(jobs[:request.limit]):
                # Update progress
                progress = (i + 1) / total_jobs * 100
                redis_client.hset(f"job:{job_id}", "progress", progress)
                
                # Process job
                processed_job = await board.process_job(job, playwright)
                if processed_job:
                    # Store in MongoDB
                    await db.jobs.insert_one({
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 