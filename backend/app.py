from sanic import Sanic
from sanic.response import json
from sanic_cors import CORS
from sanic.log import logger
import time
import os

# Get environment variables or use defaults
DEBUG = os.environ.get('DEBUG', 'True').lower() in ('true', '1', 't')
HOST = os.environ.get('HOST', '0.0.0.0')
PORT = int(os.environ.get('PORT', 8000))
APP_VERSION = os.environ.get('APP_VERSION', '1.0.0')

# Initialize Sanic app
app = Sanic("BluepacsMsgApp")
CORS(app)

# Middleware for request logging
@app.middleware("request")
async def log_request(request):
    request.ctx.request_time = time.time()
    logger.info(f"Request received: {request.method} {request.path}")

# Middleware for response logging
@app.middleware("response")
async def log_response(request, response):
    try:
        elapsed = time.time() - request.ctx.request_time
        logger.info(f"Request processed: {request.method} {request.path} - Status: {response.status} - Time: {elapsed:.4f}s")
    except AttributeError:
        pass

# Main API endpoint - converts message to uppercase
@app.route("/api/uppercase", methods=["POST"])
async def uppercase_message(request):
    try:
        data = request.json
        if not data or "message" not in data:
            return json({"error": "Please provide a message in the request body"}, status=400)
        
        original_message = data["message"]
        uppercase_message = original_message.upper()
        
        return json({
            "original": original_message,
            "uppercase": uppercase_message,
            "length": len(original_message),
            "processed_at": time.time()
        })
    except Exception as e:
        logger.error(f"Error processing message: {str(e)}")
        return json({"error": str(e)}, status=500)

# Health check endpoint
@app.route("/api/health", methods=["GET"])
async def health_check(request):
    return json({
        "status": "ok",
        "timestamp": time.time(),
        "service": "BluepacsMsgApp",
        "version": APP_VERSION
    })

# Additional API endpoint - lowercase conversion
@app.route("/api/lowercase", methods=["POST"])
async def lowercase_message(request):
    try:
        data = request.json
        if not data or "message" not in data:
            return json({"error": "Please provide a message in the request body"}, status=400)
        
        original_message = data["message"]
        lowercase_message = original_message.lower()
        
        return json({
            "original": original_message,
            "lowercase": lowercase_message,
            "length": len(original_message),
            "processed_at": time.time()
        })
    except Exception as e:
        logger.error(f"Error processing message: {str(e)}")
        return json({"error": str(e)}, status=500)

# Server info endpoint
@app.route("/api/info", methods=["GET"])
async def server_info(request):
    return json({
        "name": app.name,
        "version": APP_VERSION,
        "python_version": os.environ.get("PYTHON_VERSION", "unknown"),
        "environment": os.environ.get("ENVIRONMENT", "development"),
        "endpoints": [
            {"path": "/api/uppercase", "methods": ["POST"]},
            {"path": "/api/lowercase", "methods": ["POST"]},
            {"path": "/api/health", "methods": ["GET"]},
            {"path": "/api/info", "methods": ["GET"]}
        ]
    })

# Start the server
if __name__ == "__main__":
    logger.info(f"Starting {app.name} v{APP_VERSION} on {HOST}:{PORT} (debug: {DEBUG})")
    app.run(host=HOST, port=PORT, debug=DEBUG) 