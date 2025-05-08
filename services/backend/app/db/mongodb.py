from pymongo import MongoClient
from flask import current_app

_client = None

def init_mongodb(app):
    global _client
    if _client is None:
        _client = MongoClient(app.config.get('MONGODB_URI', 'mongodb://localhost:27017/jobboard'))

def get_mongodb_client():
    if _client is None:
        raise RuntimeError('MongoDB client not initialized')
    return _client.jobboard 