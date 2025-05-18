# Bluepacs Message API

A simple Sanic-based API that converts messages to uppercase.

## Setup

1. Install dependencies:
```
pip install -r requirements.txt
```

2. Run the server:
```
python app.py
```

The server will start on http://localhost:8000

## API Endpoints

### POST /api/uppercase
Converts a message to uppercase.

**Request Body:**
```json
{
  "message": "Hello from bluepacs"
}
```

**Response:**
```json
{
  "original": "Hello from bluepacs",
  "uppercase": "HELLO FROM BLUEPACS"
}
```

### GET /api/health
Health check endpoint.

**Response:**
```json
{
  "status": "ok"
}
``` 