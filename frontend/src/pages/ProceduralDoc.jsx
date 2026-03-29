import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import AppNavbar from '../components/AppNavbar';
import '../styles/ProceduralDoc.css';

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
- **Vector Database**: ChromaDB stores semantic embeddings of protocol documentation for RAG.

### Frontend (React + Vite)
- **Web3 Auth**: Sign-In-With-Ethereum (SIWE) for secure authentication.
- **Interactive UI**: React components with Tailwind extraction.
- **Wallet Connection**: Ethers.js for blockchain interaction.
`;

export default function ProceduralDoc() {
  return (
    <div className="doc-page">
      <AppNavbar />

      <div className="flex pt-20">
        <aside className="doc-sidebar">
          <div className="px-6 py-8">
            <h2 className="font-label text-[0.75rem] font-bold uppercase tracking-widest text-[#ff8c00] opacity-60">Documentation</h2>
          </div>
          <nav className="flex flex-col">
            <a className="cursor-pointer border-l-2 border-[#ff8c00] bg-[#353534]/20 px-6 py-4 font-label text-[0.75rem] uppercase tracking-widest text-[#ff8c00]" href="#overview">Introduction</a>
            <a className="cursor-pointer px-6 py-4 font-label text-[0.75rem] uppercase tracking-widest text-[#e5e2e1]/40 transition-colors hover:bg-[#353534]/10 hover:text-[#ffb77d]" href="#architecture">Architecture</a>
            <a className="cursor-pointer px-6 py-4 font-label text-[0.75rem] uppercase tracking-widest text-[#e5e2e1]/40 transition-colors hover:bg-[#353534]/10 hover:text-[#ffb77d]" href="#methodology">Methodology</a>
          </nav>
        </aside>

        <main className="doc-main-shell">
          <section id="overview" className="relative mb-14">
            <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-primary/5 blur-[120px]" />
            <div className="border-b border-outline-variant/10 pb-12">
              <span className="mb-4 block font-label text-xs uppercase tracking-[0.2em] text-primary">Celestial Command / v1.0.4</span>
              <h1 className="mb-8 text-5xl font-headline font-light leading-[1.1] tracking-tighter text-on-background md:text-7xl">
                Technical <span className="italic text-primary">Documentation</span>
              </h1>
              <p className="max-w-2xl text-lg font-light leading-relaxed text-on-surface-variant">
                Yield Voyager is an intelligent DeFi risk analysis platform that combines on-chain data, machine learning models, and LLM reasoning.
              </p>
            </div>
          </section>

          <section className="mb-10 rounded-xl border border-outline-variant/20 glass-card">
            <div className="flex items-center justify-between border-b border-outline-variant/20 bg-surface-container-highest px-8 py-4">
              <div className="flex items-center gap-4">
                <span className="rounded bg-green-500/20 px-3 py-1 font-label text-[10px] font-bold text-green-500">DOC</span>
                <code className="font-label text-xs text-on-surface">README.md</code>
              </div>
            </div>
            <div className="p-8 md:p-12 prose prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{DOC_CONTENT}</ReactMarkdown>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}