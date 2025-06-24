from flask import Flask, jsonify, request
import asyncio
import json
from pathlib import Path
import logging
from dotenv import load_dotenv
from src.services.scraper import scrape_jobs
from src.services.company_researcher import CompanyResearcher
from pymongo import MongoClient
import os
from flask_cors import CORS

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
CORS(app)

# Initialize MongoDB connection
mongo_client = MongoClient(os.getenv('MONGODB_CONNECTION_STRING'))
db = mongo_client.get_database()
jobs_collection = db['jobs']

def find_processed_jobs_files():
    """Find all processed_jobs.json files in the artifacts directory."""
    artifacts_dir = Path("artifacts")
    processed_jobs_files = []
    
    for path in artifacts_dir.rglob("processed_jobs.json"):
        processed_jobs_files.append(path)
    
    return processed_jobs_files

@app.route('/api/push', methods=['POST'])
def push_to_mongodb():
    """API endpoint to push jobs to MongoDB."""
    try:
        # Find all processed_jobs.json files
        job_files = find_processed_jobs_files()
        
        if not job_files:
            return jsonify({
                "status": "error",
                "message": "No processed jobs found"
            }), 404
        
        total_jobs = 0
        updated_jobs = 0
        new_jobs = 0
        errors = []
        
        for file_path in job_files:
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    jobs_list = json.load(f)
                    
                    if not isinstance(jobs_list, list):
                        logger.error(f"Invalid JSON format in {file_path}: expected a list of jobs")
                        continue
                    
                    total_jobs += len(jobs_list)
                    
                    for job in jobs_list:
                        try:
                            # Ensure job_url exists and is not None
                            if not job.get('job_url'):
                                logger.warning(f"Skipping job without job_url: {job.get('position', 'Unknown position')}")
                                continue
                            
                            # Clean the job data
                            job_data = {
                                "job_url": job["job_url"],
                                "position": job.get("position"),
                                "company": job.get("company"),
                                "location": job.get("location"),
                                "salary": job.get("salary"),
                                "tags": job.get("tags", []),
                                "posted": job.get("posted"),
                                "description": job.get("description"),
                                "job_id": job.get("job_id"),
                                "parsed_description": job.get("parsed_description"),
                                "views": job.get("views"),
                                "applicants": job.get("applicants"),
                                "apply_percentage": job.get("apply_percentage")
                            }
                            
                            # Use job_url as unique identifier
                            result = jobs_collection.update_one(
                                {"job_url": job_data["job_url"]},
                                {"$set": job_data},
                                upsert=True
                            )
                            
                            if result.modified_count > 0:
                                updated_jobs += 1
                            elif result.upserted_id:
                                new_jobs += 1
                                
                        except Exception as job_error:
                            errors.append(f"Error processing job {job.get('position', 'Unknown')}: {str(job_error)}")
                            continue
                            
            except Exception as file_error:
                errors.append(f"Error processing file {file_path}: {str(file_error)}")
                continue
        
        response = {
            "status": "success",
            "message": "Jobs pushed to MongoDB successfully",
            "stats": {
                "total_jobs_processed": total_jobs,
                "jobs_updated": updated_jobs,
                "new_jobs_added": new_jobs,
                "errors": len(errors)
            }
        }
        
        if errors:
            response["error_details"] = errors
            
        return jsonify(response)
        
    except Exception as e:
        logger.error(f"Error pushing to MongoDB: {str(e)}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

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
    """API endpoint to get jobs from MongoDB."""
    try:
        # Get query parameters for filtering
        limit = request.args.get('limit', default=50, type=int)
        skip = request.args.get('skip', default=0, type=int)
        
        # Fetch jobs from MongoDB with pagination
        jobs = list(jobs_collection.find(
            {},
            {'_id': 0}  # Exclude MongoDB _id field
        ).skip(skip).limit(limit))
        
        # Get total count for pagination
        total_jobs = jobs_collection.count_documents({})
        
        return jsonify({
            "status": "success",
            "data": jobs,
            "pagination": {
                "total": total_jobs,
                "limit": limit,
                "skip": skip,
                "has_more": (skip + limit) < total_jobs
            }
        })
    except Exception as e:
        logger.error(f"Error fetching jobs from MongoDB: {str(e)}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/api/company-info', methods=['POST'])
def get_company_info():
    """API endpoint to get company information using LangChain with web search."""
    try:
        # Get request data
        data = request.get_json()
        
        if not data:
            return jsonify({
                "status": "error",
                "message": "Request body is required"
            }), 400
        
        company_name = data.get('company_name')
        company_location = data.get('company_location')
        research_type = data.get('research_type', 'quick')  # 'quick' or 'comprehensive'
        
        if not company_name or not company_location:
            return jsonify({
                "status": "error",
                "message": "Both company_name and company_location are required"
            }), 400
        
        # Initialize company researcher
        try:
            researcher = CompanyResearcher()
        except ValueError as e:
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500
        
        # Perform research based on type
        if research_type == 'comprehensive':
            result = researcher.research_company(company_name, company_location)
        else:
            result = researcher.get_quick_company_info(company_name, company_location)
        
        if result["status"] == "error":
            return jsonify(result), 500
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error getting company info: {str(e)}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/api/company-info/quick', methods=['POST'])
def get_quick_company_info():
    """API endpoint to get quick company information using web search."""
    try:
        # Get request data
        data = request.get_json()
        
        if not data:
            return jsonify({
                "status": "error",
                "message": "Request body is required"
            }), 400
        
        company_name = data.get('company_name')
        company_location = data.get('company_location')
        
        if not company_name or not company_location:
            return jsonify({
                "status": "error",
                "message": "Both company_name and company_location are required"
            }), 400
        
        # Initialize company researcher
        try:
            researcher = CompanyResearcher()
        except ValueError as e:
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500
        
        # Get quick company info
        result = researcher.get_quick_company_info(company_name, company_location)
        
        if result["status"] == "error":
            return jsonify(result), 500
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error getting quick company info: {str(e)}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/api/company-info/comprehensive', methods=['POST'])
def get_comprehensive_company_info():
    """API endpoint to get comprehensive company information using LangChain agent."""
    try:
        # Get request data
        data = request.get_json()
        
        if not data:
            return jsonify({
                "status": "error",
                "message": "Request body is required"
            }), 400
        
        company_name = data.get('company_name')
        company_location = data.get('company_location')
        
        if not company_name or not company_location:
            return jsonify({
                "status": "error",
                "message": "Both company_name and company_location are required"
            }), 400
        
        # Initialize company researcher
        try:
            researcher = CompanyResearcher()
        except ValueError as e:
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500
        
        # Get comprehensive company info
        result = researcher.research_company(company_name, company_location)
        
        if result["status"] == "error":
            return jsonify(result), 500
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error getting comprehensive company info: {str(e)}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/api/company-info/structured', methods=['POST'])
def get_structured_company_info():
    """API endpoint to get structured company information with source links."""
    try:
        # Get request data
        data = request.get_json()
        
        if not data:
            return jsonify({
                "status": "error",
                "message": "Request body is required"
            }), 400
        
        company_name = data.get('company_name')
        company_location = data.get('company_location')
        
        if not company_name or not company_location:
            return jsonify({
                "status": "error",
                "message": "Both company_name and company_location are required"
            }), 400
        
        # Initialize company researcher
        try:
            researcher = CompanyResearcher()
        except ValueError as e:
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500
        
        # Get structured company info
        result = researcher.research_company_structured(company_name, company_location)
        
        if result["status"] == "error":
            return jsonify(result), 500
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error getting structured company info: {str(e)}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True) 