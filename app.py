from flask import Flask, jsonify, request
import asyncio
import json
from pathlib import Path
import logging
from dotenv import load_dotenv
from src.services.scraper import scrape_jobs

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

@app.route('/api/scrape', methods=['POST'])
def start_scraping():
    """API endpoint to start the scraping process."""
    try:
        job_type = request.json.get('job_type', 'devops_engineer')
        limit = request.json.get('limit', 3)
        cookies = request.json.get('cookies')
        
        # Run the scraping process
        result = asyncio.run(scrape_jobs(job_type, limit, cookies))
        return jsonify(result)
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/api/jobs')
def get_jobs():
    """API endpoint to get the latest scraped jobs."""
    try:
        # Get the latest run directory
        base_dir = Path("artifacts/remoteok/devops_engineer")
        if not base_dir.exists():
            return jsonify({
                "status": "error",
                "message": "No jobs have been scraped yet"
            }), 404
            
        # Get the most recent run directory
        run_dirs = sorted([d for d in base_dir.iterdir() if d.is_dir()], reverse=True)
        if not run_dirs:
            return jsonify({
                "status": "error",
                "message": "No jobs have been scraped yet"
            }), 404
            
        latest_run = run_dirs[0]
        jobs_file = latest_run / "processed_jobs.json"
        
        if not jobs_file.exists():
            return jsonify({
                "status": "error",
                "message": "No processed jobs found in the latest run"
            }), 404
            
        with open(jobs_file, 'r', encoding='utf-8') as f:
            jobs = json.load(f)
            
        return jsonify({
            "status": "success",
            "data": jobs,
            "run_directory": str(latest_run)
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True) 