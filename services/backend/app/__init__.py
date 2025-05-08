from flask import Flask
from flask_cors import CORS
from .db.mongodb import init_mongodb
from .queue.redis import init_redis
from .routes import register_routes

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Initialize database connections
    init_mongodb(app)
    init_redis(app)

    # Register routes
    register_routes(app)

    return app 