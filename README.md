# YieldVoyager

YieldVoyager is an intelligent, full-stack DeFi risk analysis platform that helps investors navigate the complexities of decentralized finance. It utilizes a powerful Multi-Model Machine Learning Engine and a ChromaDB-backed Retrieval Augmented Generation (RAG) system to provide personalized, real-time risk assessments.

## Core Architecture

### 1. Multi-Model Risk Engine
The system dynamically loads up to 10 distinct trained Machine Learning models (`.pkl` format) from the backend. Instead of relying on a single algorithm, YieldVoyager aggregates predictions across all models to generate a highly robust and balanced **Aggregate Risk Score**. Individual model scores are also preserved for granular analysis.

### 2. Live Market Vector Context (ChromaDB)
YieldVoyager features a background APScheduler that polls real-time protocol data (TVL, APY, Chain) from DeFiLlama. This data is intelligently chunked, embedded, and stored into ChromaDB. During inference, the RAG pipeline retrieves the most relevant historical and market contexts to root the LLM's logic in factual data.

### 3. Personalized LLM Explanations
The aggregate risk scores, individual model predictions, and ChromaDB vector contexts are piped into the Gemini Large Language Model. Factoring in the user’s Web3-authenticated global profile preferences (**Risk Tolerance** and **Investment Goal**), the LLM generates deeply personalized, human-readable investment thesis explanations.

### 4. Full-Stack Tech
- **Frontend**: React + Vite + TailwindCSS. Sleek dark-mode UX, intuitive charting, dynamic ML Dropdowns, interactive web3 wallet integration.
- **Backend & Auth**: Django REST Framework + Web3 SIWE (Sign-In-With-Ethereum).
- **Network Ecosystem Analysis**: Includes an "Analyze All Protocols" endpoint that assesses the holistic market state and recommends the paramount yield strategy.

## Getting Started

1. Place the 10 trained `.pkl` models inside `backend/risk_engine/ml_assets/models/`.
2. Place the ML raw dataset CSV inside `backend/risk_engine/ml_assets/data/`.
3. Set your `GEMINI_API_KEY` in your `.env` file.
4. Run migrations: `python manage.py migrate`
5. Start the backend: `python manage.py runserver`
6. Start the frontend: `npm run dev` in the `frontend/` directory.

## Team Members:
(List team members here)
