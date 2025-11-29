#!/bin/bash

# Veridian Local Testing Script
# Run this after Node.js installation

echo "🚀 Veridian Local Testing Setup"
echo "================================"
echo ""

# Step 1: Install Frontend Dependencies
echo "📦 Step 1: Installing frontend dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi
echo "✅ Frontend dependencies installed"
echo ""

# Step 2: Setup Python Virtual Environment
echo "🐍 Step 2: Setting up Python environment..."
python3 -m venv venv
source venv/bin/activate
pip install -r api/requirements.txt
if [ $? -ne 0 ]; then
    echo "❌ Failed to install Python dependencies"
    exit 1
fi
echo "✅ Python dependencies installed"
echo ""

# Step 3: Verify Data
echo "📊 Step 3: Verifying dataset..."
if [ -f "api/data/pune_properties.json" ]; then
    PROP_COUNT=$(grep -o '"id"' api/data/pune_properties.json | wc -l)
    echo "✅ Dataset found with $PROP_COUNT properties"
else
    echo "ℹ️  Dataset not found. Generating..."
    python3 api/scripts/generate_data.py
fi
echo ""

# Step 4: Check Environment Variables
echo "🔑 Step 4: Checking environment variables..."
if [ -f ".env" ]; then
    echo "✅ .env file found"
else
    echo "⚠️  .env file not found"
    echo "ℹ️  Please create .env with:"
    echo "   VITE_MAPBOX_TOKEN=your_token_here"
    echo ""
    echo "Get free token at: https://account.mapbox.com/"
fi
echo ""

echo "================================"
echo "✨ Setup Complete!"
echo ""
echo "📝 Next Steps:"
echo ""
echo "1. Add Mapbox token to .env file (required for map)"
echo "   VITE_MAPBOX_TOKEN=your_token"
echo ""
echo "2. Start Frontend (Terminal 1):"
echo "   npm run dev"
echo "   → Opens at http://localhost:5173"
echo ""
echo "3. Start Backend (Terminal 2):"
echo "   source venv/bin/activate"
echo "   uvicorn api.index:app --reload --port 8000"
echo "   → API runs at http://localhost:8000"
echo ""
echo "4. Open http://localhost:5173 in your browser"
echo ""
echo "================================"
