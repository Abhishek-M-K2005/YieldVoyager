# YieldVoyager 🛸

**YieldVoyager** is a professional-grade DeFi risk analysis and investment orchestration platform. It combines a high-fidelity **Multi-Model Machine Learning Ensemble** with a **ChromaDB-backed RAG (Retrieval-Augmented Generation)** pipeline to provide deeply personalized, data-rooted risk assessments for decentralized protocols.


---

## 🌟 Key Features

### 🧠 1. Multi-Model Ensemble Engine
Unlike traditional systems that rely on a single analysis vector, YieldVoyager utilizes an ensemble of **10 distinct ML models** (including XGBoost, LightGBM, CatBoost, Random Forest, and Extra Trees).
- **Aggregate Scoring**: Generates a balanced 1.0 - 10.0 risk score.
- **Divergence Analysis**: Identifies when models disagree (e.g., CatBoost flagging categorical anomalies while XGBoost sees stability).

### 📚 2. Real-Time RAG Pipeline (ChromaDB)
The system maintains a living "memory" of the DeFi ecosystem.
- **Background Sync**: An APScheduler-driven worker polls **DeFiLlama** every 15 minutes.
- **Vector Context**: Real-time metrics (TVL changes, liquidity depth) are embedded into **ChromaDB**.
- **Contextual Retrieval**: During analysis, the system retrieves relevant historical context to ensure AI responses are rooted in factual market data.

### 🤖 3. Personalized AI Advisor
Powered by **Google Gemini 1.5 Flash**, our AI advisor acts as a technical DeFi analyst.
- **Hyper-Personalized**: Factors in user-specific **Risk Tolerance** (Low/Med/High) and **Investment Goals** (e.g., "Long-term growth").
- **Structured Output**: Delivers verbose, Markdown-formatted technical theses including comparative insights and execution plans.

### 🔐 4. Web3 Authentication (SIWE)
- **Decentralized Identity**: Sign-In-With-Ethereum (SIWE) implementation using MetaMask.
- **Secure Persistence**: JWT-based session management linked to wallet addresses.

---

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, TailwindCSS (Tipography), Recharts, Ethers.js, Lucide Icons |
| **Backend** | Python 3.12, Django, Django REST Framework, APScheduler |
| **Database** | SQLite (Metadata), ChromaDB (Vector Store) |
| **AI/ML** | Google Gemini API, Scikit-learn, XGBoost, CatBoost, LightGBM |
| **Auth** | Web3 (Ethers.js), Sign-In-With-Ethereum (SIWE) |

---

## 📂 Project Structure

```bash
YieldVoyager/
├── backend/                # Django REST API (Python 3.12)
│   ├── auth_web3/          # SIWE (Web3) Auth & User Profiles
│   ├── backend/            # Django Project Configuration & Settings
│   ├── chroma_db/          # Persistent Vector Store (ChromaDB)
│   ├── defi/               # Scheduler & DeFiLlama Data Aggregator
│   ├── risk_engine/        # Core Multi-Model & RAG Logic
│   │   ├── accessories/    # Supplementary Metadata & Data Links
│   │   ├── ml_assets/      # ML Model Storage
│   │   │   └── models/     # 10+ Trained Ensemble Models (.pkl)
│   │   └── services/       # VectorDB, LLM, Scoring, and Inference Logic
│   ├── manage.py           # Django Entry Point
│   └── requirements.txt    # Backend Dependencies
├── frontend/               # React + Vite Application
│   ├── src/
│   │   ├── api/            # API Service Layer
│   │   ├── components/     # Reusable UI Components (Header, etc.)
│   │   ├── context/        # Global Auth & State Management
│   │   └── pages/          # Application Views (Dashboard, Prediction, Profile)
│   ├── tailwind.config.js  # Styling Configuration
│   └── vite.config.js      # Build & Dev Tooling
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- Python (3.10+)
- MetaMask Browser Extension

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: .\venv\Scripts\activate
pip install -r requirements.txt

# Initial Setup
python manage.py migrate
python manage.py createsuperuser # Optional

# Configure Environment
# Create a .env file in the backend directory:
# GEMINI_API_KEY=your_key_here
# DEBUG=True

# Start syncing data & Server
python manage.py runserver
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Visit `http://localhost:5173` to explore the Voyager.

---

## 📊 AI Output Sample
```markdown
### DeFi Risk Analysis: Binance Protocol
**Score: 4.05/10.0 (Medium Risk)**

1. **Extended Technical Analysis**: 
   - XGBoost (0.04) suggests extreme stability based on liquidity depth.
   - CatBoost (0.99) flags a critical anomaly in TVL velocity (0.0% change over 7 days).
2. **Comparative Insights**: Live data validates the RAG context trajectory but shows a "plateau phase" not seen in historical SSM snapshots.
3. **Strategic Prediction**: For a "Medium" risk profile seeking "Long-term growth," we recommend a 30% deployment...
```

---

## 🛡️ License
Distributed under the MIT License. See `LICENSE` for more information.

## 👥 Team
- **Adarsh** (Lead Developer)
- YieldVoyager Core Team
