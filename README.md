# Bluepacs Message Converter Project

This project consists of a React frontend and a Sanic Python backend that work together to convert text messages to uppercase.

## Project Structure

- `/frontend` - React frontend application
- `/backend` - Sanic Python backend API

## Running with Docker (Recommended)

The easiest way to run the application is using Docker Compose:

```bash
docker-compose up -d
```

This will build and start both the frontend and backend services. The application will be available at:
- Frontend: http://localhost
- Backend API: http://localhost/api (proxied through Nginx)

To stop the containers:

```bash
docker-compose down
```

## Running without Docker

### Backend Setup

1. Navigate to the backend directory:
```
cd backend
```

2. Install dependencies:
```
pip install -r requirements.txt
```

3. Run the backend server:
```
python app.py
```

The backend server will start on http://localhost:8000

### Frontend Setup

1. Navigate to the frontend directory:
```
cd frontend
```

2. Install dependencies:
```
npm install
```

3. Start the development server:
```
npm start
```

The frontend application will start on http://localhost:3000

## How It Works

1. Enter a message in the text input field on the frontend
2. Click the "Convert" button
3. The message is sent to the backend API
4. The backend converts the message to uppercase
5. The result is returned to the frontend and displayed

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

## Docker Information

The application uses a multi-container Docker setup:

1. **Backend Container**:
   - Python 3.11 with Sanic API
   - Exposed on port 8000 within the Docker network
   - Health check endpoint at /api/health

2. **Frontend Container**:
   - Two-stage build process (Node.js build, Nginx serve)
   - Nginx serves static files and proxies API requests to the backend
   - Exposed on port 80 