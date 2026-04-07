# YieldVoyager Backend 🛸

The backend for YieldVoyager is a robust **Django REST Framework** application. It serves as the orchestration layer for DeFi data fetching, Machine Learning inference, and Vector DB retrieval.

## 🚀 Built With

- **Django 5.0** (Web Framework)
- **Django REST Framework** (API)
- **APScheduler** (Background Job Execution)
- **ChromaDB** (Vector Database for RAG)
- **Google Gemini API** (LLM Orchestration)
- **Scikit-learn / XGBoost** (ML Inference)

## 🛠️ Getting Started

### 1. Installation
```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Configure Environment
Create a `.env` file in the `backend` root:
```bash
GEMINI_API_KEY=your_key
DEBUG=True
DATABASE_URL=sqlite:///db.sqlite3
```

### 3. Database & Sync
```bash
python manage.py migrate
# The data sync will start automatically when the server runs
python manage.py runserver
```

## 🏗️ Core Services

### `risk_engine.services.model`
Handles the dynamic loading of 10 trained `.pkl` models. It ensures that all models receive the same feature vector and aggregates their predictions into a unified risk score.

### `risk_engine.services.vector_db`
Manages the **ChromaDB** collection. It embeds protocol metadata and retrieves historical context during inference to root the AI's logic in factual data.

### `defi.scheduler`
A background worker that polls **DeFiLlama's** API every 15 minutes. It updates the PostgreSQL/SQLite database with the latest protocol metrics and pushes them into the Vector DB.

### `auth_web3`
Implements **SIWE (Sign-In-With-Ethereum)**. It generates nonces, verifies signatures, and issues JWT tokens for secure wallet-based authentication.
