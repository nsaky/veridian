# 🏢 Veridian - AI-Powered Real Estate Investment Analyst

> **"The Bloomberg Terminal for Real Estate"**

Veridian is an intelligent real estate investment platform that leverages AI to help investors make data-driven property decisions. Built with **Google Gemini AI**, the platform provides property analysis, risk assessment, and investment recommendations with zero hallucination through Retrieval Augmented Generation (RAG).

---

## � **MVP Scope: Pune, India**

> ⚠️ **Important**: This MVP is currently focused exclusively on **Pune, Maharashtra, India**

### **Coverage Areas (15 Localities)**

Veridian currently covers the following prime areas in Pune:

1. **Baner** - West Pune tech hub
2. **Hinjewadi** - IT Park & startup ecosystem
3. **Viman Nagar** - Airport proximity & connectivity
4. **Koregaon Park** - Premium residential area
5. **Wagholi** - Emerging affordable zone
6. **Kothrud** - Established residential locality
7. **Magarpatta** - IT corridor & business district
8. **Aundh** - Educational & residential hub
9. **Pimpri-Chinchwad** - Industrial & residential
10. **Hadapsar** - IT parks & connectivity
11. **Wakad** - Growing suburban area
12. **Kalyani Nagar** - Upscale residential
13. **Mundhwa** - Tech parks vicinity
14. **Undri** - Budget-friendly emerging area
15. **Wanowrie** - Cantonment adjacency

**Total Properties in Database**: 1,000 properties across 4 types (Apartments, Villas, Plots, Commercial Shops)

---

## ✨ **Key Features**

### 🤖 **AI-Powered Chat Agent**
- **Google Gemini 2.5 Flash** integration
- RAG (Retrieval Augmented Generation) pipeline to prevent hallucination
- Context-aware responses using live property data
- Property-specific deep analysis on demand

### �️ **Interactive Map Search**
- Mapbox GL JS integration with custom markers
- Real-time filtering synchronized with AI chat
- Automatic zoom to searched localities
- "Explore with Veridian" button for property-specific analysis
- Color-coded markers based on investment scores

### 📊 **Investment Analysis**
- **Veridian Score** - Proprietary scoring algorithm
- Risk appetite adjustment (Conservative/Moderate/Aggressive)
- Rental yield calculations
- 5-year appreciation projections
- RERA status & litigation checks
- Metro proximity analysis

### 🏠 **Property Features**
- **4 Property Types**: Apartments, Villas, Residential Plots, Commercial Shops
- Detailed property pages with investment memos
- Financial metrics visualization
- Developer credibility ratings
- Legal status traffic lights

### 👤 **User Profile Management**
- Risk appetite customization
- Profile completion tracking
- Editable personal information
- Investment preferences

---

## 🛠️ **Tech Stack**

### **Frontend**
- **React 18** - UI framework
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animations
- **Mapbox GL JS** - Interactive maps
- **Recharts** - Data visualization
- **Lucide React** - Icon library

### **Backend**
- **FastAPI** - Python web framework
- **Google Generative AI** (google-genai SDK v1.52.0)
- **Pandas** - Data manipulation for RAG
- **Uvicorn** - ASGI server

### **Deployment**
- **Vercel** - Monorepo deployment
- **Serverless Functions** - Python backend
- **Environment Variables** - Secure API key management

---

## � **Getting Started**

### **Prerequisites**

- **Node.js** 18+ and npm
- **Python** 3.10+
- **Google Gemini API Key** ([Get one here](https://ai.google.dev/gemini-api/docs/api-key))
- **Mapbox Access Token** ([Get one here](https://account.mapbox.com/))

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/veridian.git
cd veridian
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r api/requirements.txt
```

4. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# Frontend (Vite)
VITE_MAPBOX_TOKEN=your_mapbox_token_here

# Backend (loaded by server)
GEMINI_API_KEY=your_gemini_api_key_here
```

5. **Generate property data** (already included, but you can regenerate)
```bash
python api/scripts/generate_data.py
```

---

## 🏃 **Running Locally**

### **Option 1: Run Both Servers Separately**

**Terminal 1 - Backend:**
```bash
export GEMINI_API_KEY=your_gemini_api_key_here
uvicorn api.index:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

The app will be available at **http://localhost:5173**

### **Option 2: Quick Start Script**

```bash
./start-veridian.sh  # Coming soon
```

---

## 📁 **Project Structure**

```
veridian/
├── api/                          # Backend (Python FastAPI)
│   ├── index.py                  # Main API with RAG pipeline
│   ├── requirements.txt          # Python dependencies
│   ├── data/
│   │   └── pune_properties.json  # 1000 property dataset
│   └── scripts/
│       └── generate_data.py      # Data generation script
├── src/                          # Frontend (React)
│   ├── pages/
│   │   ├── Onboarding.jsx        # Welcome & risk profile
│   │   ├── Home.jsx              # Dashboard with widgets
│   │   ├── Search.jsx            # AI Chat + Map interface
│   │   ├── PropertyDetail.jsx    # Investment memo page
│   │   └── Profile.jsx           # User profile management
│   ├── components/
│   │   ├── features/             # Chat, Map, Search intake
│   │   ├── layout/               # Navbar
│   │   └── ui/                   # Button, Card, Input
│   ├── context/
│   │   └── MapContext.jsx        # Global map state
│   ├── lib/
│   │   └── api.js                # API client
│   ├── index.css                 # Global styles
│   └── main.jsx                  # Entry point
├── .env                          # Environment variables
├── vercel.json                   # Deployment config
├── tailwind.config.js            # Tailwind configuration
└── README.md                     # This file
```

---

## 🎯 **How It Works**

### **The RAG Pipeline (Zero Hallucination)**

1. **User Query** → "Show me properties in Baner under 2Cr"
2. **Intent Extraction** → Regex parsing: `locality="Baner"`, `max_price=2Cr`
3. **Data Filtering** → Pandas filters 1000 properties → 15 matches
4. **Context Creation** → Top 15 properties converted to JSON
5. **Gemini Query** → System prompt + context + user question
6. **AI Response** → Gemini generates answer using ONLY the provided data
7. **Map Command** → AI returns `map_action` JSON with property IDs, coordinates, zoom level
8. **Frontend Update** → Chat displays AI response, map filters & zooms automatically

**Result**: AI can ONLY answer based on actual property data, preventing hallucination.

---

## 🎨 **Design System**

### **"Matrix Green" Theme**
- **Primary**: Neon Green (#00ff9f)
- **Background**: Deep Dark (#0a0f1a, #111827, #1a202c)
- **Text**: White gradients for hierarchy
- **Effects**: Glassmorphism, neon borders, smooth animations

### **Typography**
- **Sans**: Inter (body text)
- **Mono**: JetBrains Mono (numbers, code)

---

## � **Testing the Platform**

### **Test Queries to Try**

1. **Location-based**:
   - "Show me properties in Viman Nagar"
   - "Find villas in Baner"

2. **Price filtering**:
   - "Properties under 2 crore in Hinjewadi"
   - "Affordable apartments in Wagholi"

3. **Investment focus**:
   - "Which property has the best rental yield?"
   - "Show me high-appreciation properties"
   - "Find safe properties with no legal issues"

4. **Property-specific**:
   - Click any map pin → "Explore with Veridian" → Detailed AI analysis

---

## 🔑 **Environment Variables**

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_MAPBOX_TOKEN` | Mapbox API token for interactive maps | ✅ Yes |
| `GEMINI_API_KEY` | Google Gemini AI API key | ✅ Yes |

---

## � **Deployment**

### **Deploy to Vercel**

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy!

```bash
vercel --prod
```

Vercel will automatically:
- Build the React frontend
- Deploy Python backend as serverless functions
- Set up automatic HTTPS
- Enable preview deployments for PRs

---

## 📊 **Dataset Details**

### **Property Distribution**
- **Apartments**: 500 (50%)
- **Villas**: 150 (15%)
- **Residential Plots**: 200 (20%)
- **Commercial Shops**: 150 (15%)

### **Price Range**
- Budget: ₹40L - ₹1.5Cr
- Mid-range: ₹1.5Cr - ₹5Cr
- Premium: ₹5Cr - ₹15Cr

### **Special Properties**
- **Gold Properties**: 50 properties in Baner near Metro Line 3 (55%+ appreciation)
- **Trap Properties**: 50 high-risk properties (litigation or revoked RERA)

---

## 🤝 **Contributing**

Contributions are welcome! Please feel free to submit a Pull Request.

---

## � **License**

This project is licensed under the MIT License.

---

## � **Acknowledgments**

- **Google Gemini AI** for powering the intelligence
- **Mapbox** for beautiful, fast maps
- **FastAPI** for the elegant Python backend
- **React & Vite** for the smooth frontend experience

---

## 📞 **Contact**

For questions, suggestions, or collaboration:
- **Email**: yasir@veridian.ai
- **GitHub**: [@yasireqbal](https://github.com/yasireqbal)

---

**Built with ❤️ for smarter real estate investing**

🏢 Veridian - Making Property Investment Transparent, Data-Driven, and Intelligent.
