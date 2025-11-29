#!/bin/bash

echo "🚀 VERIDIAN v2.0 - Quick Start"
echo "=============================="
echo ""

# Check if servers are already running
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Backend already running on port 8000"
else
    echo "✅ Port 8000 available"
fi

if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Frontend already running on port 5173"
else
    echo "✅ Port 5173 available"
fi

echo ""
echo "📝 To start Veridian v2.0:"
echo ""
echo "=== Terminal 1 - Backend ==="
echo "cd /Users/yasireqbal/Desktop/veridian"
echo "source venv/bin/activate"
echo "export GOOGLE_API_KEY=AIzaSyBEotBZhfgVagw5p0r4DJjhw1x7h-hU6cc"
echo "uvicorn api.index:app --reload --port 8000"
echo ""
echo "=== Terminal 2 - Frontend ==="
echo "cd /Users/yasireqbal/Desktop/veridian"
echo "npm run dev"
echo ""
echo "=== Access ==="
echo "Frontend: http://localhost:5173"
echo "Backend API: http://localhost:8000"
echo "API Docs: http://localhost:8000/docs"
echo ""
echo "🧪 Test Queries:"
echo "  1. 'Show me villas in Baner under 3 crore'"
echo "  2. 'Find safe commercial properties in Koregaon Park'"
echo "  3. 'I want plots in Wagholi'"
echo ""
echo "📊 Dataset: 1,000 properties"
echo "  - 500 Apartments"
echo "  - 150 Villas"
echo "  - 200 Plots"
echo "  - 150 Commercial"
echo ""
chmod +x start-veridian.sh 2>/dev/null
