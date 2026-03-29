import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Header from '../components/Header';

const DOC_CONTENT = `
# YieldVoyager Technical Documentation

## 1. Project Overview
Yield Voyager is an intelligent DeFi risk analysis platform that helps investors navigate the complexities of decentralized finance. It combines on-chain data, an ensemble of machine learning risk models, and a Retrieval-Augmented Generation (RAG) pipeline to provide distinct, highly personalized actionable insights.

---

## 2. System Architecture

The system is built on a resilient Full-Stack blueprint ensuring scalability, context-awareness, and security:

### 2.1 Backend (Django + Python REST)
- **API Engine**: Django REST Framework serving dynamic model inference to the React frontend.
- **Web3 SIWE Auth**: Decentralized Sign-In-With-Ethereum guaranteeing secure profiling without centralized passwords.
- **Scheduler**: An APScheduler polling real-time Yield, TVL, and Chain data from DeFiLlama every 15 minutes to guarantee market synchronization.

### 2.2 The Multi-Model ML Ensemble
We employ a cutting-edge ensemble approach for empirical security analysis:
- The Risk Engine dynamically loads 10 unique \`.pkl\` Machine Learning models to analyze protocol extraction data (audit count, util ratio).
- **Aggregation Engine**: Rather than utilizing a single model node, the architecture merges output from all 10 pipelines to produce an **"Aggregate Consensus"** risk score (1-100).
- **Granularity**: The architecture allows instantaneous isolation of individual model predictions on the frontend matrix via explicit UI dropdown controls.

### 2.3 RAG & LLM Integration (ChromaDB)
The subjective human-readable element is heavily rooted in factual intelligence:
- Embedded DeFi snapshots are stored dynamically into **ChromaDB**.
- The inference logic performs Contextual Retrieval against Chroma vectors and injects this data tightly into a Prompt Structure for the **Gemini LLM**.
- **Personalization**: User preferences (**Risk Tolerance**, **Investment Goals**) sourced natively from the Web3 wallet profile alter the mathematical reasoning behind the LLM analysis, tuning safety heuristics on a per-investor basis. 

---

## 3. Web3 Profile & Security
- **Non-Custodial**: We never request or interact with user private keys.
- **Database Schema Storage**: Investment goals and preferences are cryptographically tied to lower-case EVM addresses inside our PostgreSQL database schema.

---

## 4. Endpoint Reference Map

#### Ensembled Risk Prediction (\`/api/risk/protocol/{id}/\`)
Calculates mathematical risk aggregating 10 models + textual LLM justification.

#### Master Ecosystem Analysis (\`/api/risk/best_protocol/\`)
Computes vectors across the entire Protocol tracking grid, synthesizing all global models into one conclusive RAG-based recommendation.

#### Web3 Profile Access (\`/api/auth/profile/\`)
Fetches persistent AI pipeline user parameters globally syncing the entire React frontend.
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
