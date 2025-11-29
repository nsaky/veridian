#!/bin/bash

# Veridian Backend Startup Script
# Ensures environment variables are loaded

echo "🚀 Starting Veridian Backend with Gemini AI..."

# Load environment variables from .env
export $(grep -v '^#' .env | xargs)

# Verify API key is loaded
if [ -z "$GOOGLE_API_KEY" ]; then
    echo "❌ ERROR: GOOGLE_API_KEY not found!"
    echo "Please ensure .env file exists with GOOGLE_API_KEY=your_key"
    exit 1
fi

echo "✅ GOOGLE_API_KEY loaded"
echo "✅ Starting FastAPI server..."

# Activate virtual environment
source venv/bin/activate

# Start uvicorn
uvicorn api.index:app --reload --port 8000
