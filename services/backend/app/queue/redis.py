import redis
from flask import current_app

_client = None

def init_redis(app):
    global _client
    if _client is None:
        _client = redis.Redis(
            host=app.config.get('REDIS_HOST', 'localhost'),
            port=app.config.get('REDIS_PORT', 6379),
            decode_responses=True
        )

def get_redis_client():
    if _client is None:
        raise RuntimeError('Redis client not initialized')
    return _client 