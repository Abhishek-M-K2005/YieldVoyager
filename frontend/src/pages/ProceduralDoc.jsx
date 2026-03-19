import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Header from '../components/Header';

const DOC_CONTENT = `
# Yield Voyager Technical Documentation

## 1. Project Overview
Yield Voyager is an intelligent DeFi risk analysis platform that helps investors navigate the complexities of decentralized finance. It combines on-chain data, machine learning risk models, and large language models (LLMs) to provide actionable insights.

### Core Features
- **Real-time Risk Scoring**: Automatic assessment of protocol safety.
- **AI-Powered Explanations**: Human-readable reasoning for risk scores.
- **Portfolio Tracking**: Connect your wallet to view personalized stats.
- **Market Trends**: Aggregated view of DeFi yields and TVL.

---

## 2. System Architecture

The system is built on a modern stack ensuring scalability and security.

### Backend (Django + Python)
- **API Engine**: Django REST Framework serving data to the frontend.
- **Risk Engine**: Python-based ML pipeline for calculating protocol risk scores.
- **Vector Database**: ChromaDB stores semantic embeddings of protocol documentation for RAG (Retrieval Augmented Generation).
- **Scheduler**: APScheduler runs periodic tasks to fetch fresh data from DeFiLlama.

### Frontend (React + Vite)
- **Web3 Auth**: Sign-In-With-Ethereum (SIWE) for secure, decentralized authentication.
- **Interactive UI**: Tailstorm components for a sleek, dark-mode experience.
- **Wallet Connection**: Ethers.js for blockchain interaction.

---

## 3. Machine Learning Methodology

Our risk engine uses a multi-factor approach:

1.  **Quantitative Analysis**:
    -   Audit History
    -   TVL Stability (30-day volatility)
    -   Impermanent Loss Risk
    -   Protocol Age

2.  **Qualitative Analysis (LLM)**:
    -   Analysis of governance structures.
    -   Review of smart contract complexity.
    -   Team transparency checks.

### Scoring Algorithm
The final risk score (0-100) is a weighted average:
\`\`\`python
risk_score = (audit_score * 0.4) + (volatility_score * 0.3) + (team_score * 0.3)
\`\`\`
- **0-30**: Low Risk (Safe)
- **31-70**: Medium Risk (Caution)
- **71-100**: High Risk (Degen)

---

## 4. Smart Contract Security

We prioritize user safety.

- **Non-Custodial**: We never ask for your private keys.
- **Read-Only Access**: The app only asks for public data permissions.
- **Verified Source**: All risk models are open-source and verifiable.

---

## 5. Development Roadmap

- [x] **Phase 1**: Beta Launch (Current)
- [ ] **Phase 2**: Social Sentiment Analysis Integration
- [ ] **Phase 3**: Cross-chain Portfolio Rebalancing
- [ ] **Phase 4**: DAO Governance Module

## 6. API Reference

#### Get Protocol Risk
\`GET /api/risk/protocol/{id}/\`
Returns the risk score and LLM explanation for a specific protocol.

#### Get Market Data
\`GET /api/defi/market/today/\`
Returns aggregated market stats (Top Gainers, Losers).

#### User Profile
\`GET /api/auth/profile/\`
Secured endpoint to fetch user settings.
`;

export default function ProceduralDoc() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9]">
      <Header />
      
      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* GitHub Repository Header Style */}
        <div className="mb-6 border-b border-[#30363d] pb-4">
            <h1 className="text-2xl font-semibold text-white flex items-center gap-2">
                <svg viewBox="0 0 16 16" width="24" height="24" className="fill-current text-[#8b949e]" aria-hidden="true"><path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 0 1 1-1h8ZM5 12.25v3.25a.25.25 0 0 0 .4.2l1.45-1.087a.249.249 0 0 1 .3 0L8.6 15.7a.25.25 0 0 0 .4-.2v-3.25a.25.25 0 0 0-.25-.25h-3.5a.25.25 0 0 0-.25.25Z"></path></svg>
                Procedural Documentation
            </h1>
        </div>

        {/* GitHub File Container */}
        <div className="border border-[#30363d] rounded-md bg-[#0d1117] overflow-hidden">
            {/* File Header */}
            <div className="bg-[#161b22] px-4 py-3 border-b border-[#30363d] text-sm text-[#c9d1d9] flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <svg viewBox="0 0 16 16" width="16" height="16" className="fill-current" aria-hidden="true"><path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V4.664a.25.25 0 0 0-.073-.177l-2.914-2.914a.25.25 0 0 0-.177-.073ZM8 3.25a.75.75 0 0 1 .75.75v1.5h1.5a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1-.75-.75v-2a.75.75 0 0 1 .75-.75Z"></path></svg>
                    <span className="font-semibold">README.md</span>
                </div>
                <div className="flex gap-2">
                     <span className="px-2 py-1 bg-[#21262d] border border-[#30363d] rounded text-xs font-semibold hover:text-[#58a6ff] hover:border-[#8b949e] cursor-pointer transition-colors">Raw</span>
                     <span className="px-2 py-1 bg-[#21262d] border border-[#30363d] rounded text-xs font-semibold hover:text-[#58a6ff] hover:border-[#8b949e] cursor-pointer transition-colors">Copy</span>
                </div>
            </div>

            {/* Markdown Content */}
            <div className="p-8 md:p-12 prose prose-invert max-w-none prose-headings:border-b prose-headings:border-[#21262d] prose-headings:pb-2 prose-a:text-[#58a6ff] prose-a:no-underline hover:prose-a:underline prose-code:text-[#c9d1d9] prose-code:bg-[#161b22] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:bg-[#161b22] prose-pre:border prose-pre:border-[#30363d] prose-blockquote:border-l-4 prose-blockquote:border-[#30363d] prose-blockquote:text-[#8b949e] prose-table:border-collapse prose-th:border prose-th:border-[#30363d] prose-th:p-2 prose-td:border prose-td:border-[#30363d] prose-td:p-2 text-[#c9d1d9]">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {DOC_CONTENT}
                </ReactMarkdown>
            </div>
        </div>
      </main>
    </div>
  );
}
