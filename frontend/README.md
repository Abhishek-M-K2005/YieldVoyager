# YieldVoyager Frontend 🛸

The frontend for YieldVoyager is a high-performance, responsive React application built with **Vite** and **TailwindCSS**. It provides a sleek, dark-themed interface for DeFi risk analysis, charting, and Web3 orchestration.

## 🚀 Built With

- **React 18** (Functional Components & Hooks)
- **Vite** (Build Tool)
- **TailwindCSS** (Styling & Typography)
- **Ethers.js** (Web3 Interaction)
- **Recharts** (Data Visualization)
- **Lucide React** (Icons)
- **React Markdown** (AI Response Formatting)

## 🛠️ Getting Started

### 1. Installation
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file in the `frontend` root:
```bash
VITE_API_URL=http://localhost:8000
```

### 3. Start Development
```bash
npm run dev
```

## 📂 Core Components

### `AuthContext`
Manages the global state for MetaMask connection, balance retrieval, and SIWE session persistence.

### `RiskPrediction`
The primary analysis engine UI. It handles:
- Multi-parameter form (Risk Tolerance, Goals).
- Dynamic protocol selection.
- Visualizing risk factors via Radar Charts.
- Rendering technical AI theses using `ReactMarkdown`.

### `Header`
Displays real-time network health, block number, and connection status.

## 🎨 Styling
We use **TailwindCSS** with a custom color palette focused on deep slates (`#0f172a`) and vibrant violets/greens for state indication. The `@tailwindcss/typography` plugin is used to handle complex AI Markdown outputs.
