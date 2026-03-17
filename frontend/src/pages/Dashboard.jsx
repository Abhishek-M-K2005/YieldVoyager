import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { computeRisk } from "../api/risk";
import { ethers } from "ethers";

export default function Dashboard() {
  const { wallet, balance, network, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [riskResult, setRiskResult] = useState(null);

  const handleComputeRisk = async () => {
    try {
      const metrics = {
        tvl_change_24h: -0.05,
        tvl_change_7d: -0.12,
        liquidity_depth: 1000000,
        utilization_ratio: 0.65,
        oracle_price_std: 0.08,
        liquidation_spike_ratio: 1.3,
        protocol_age_days: 600,
        audit_count: 3,
        wallet_address: wallet,
        wallet_balance: balance
      };

      const result = await computeRisk(1, metrics);
      setRiskResult(result);
    } catch (error) {
      console.error("Risk computation failed:", error);
    }
  };

  const handleDeposit = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask to execute trades.");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Sending a 0 ETH transaction as a stub/placeholder for a real contract call
      const tx = await signer.sendTransaction({
        to: wallet, // Placeholder recipient
        value: ethers.parseEther("0.0"),
      });
      alert(`Transaction Submitted! Hash: ${tx.hash}`);
    } catch (err) {
      console.error("Transaction failed or rejected:", err);
      alert("Transaction was rejected or failed.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Top Action Bar */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Yield <span className="text-violet-500">Voyager</span></h1>
            <p className="text-gray-400 mt-2">Yield optimization and risk metrics are live.</p>
          </div>
          <button
            onClick={() => navigate('/profile')}
            className="bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-2 rounded-full transition-all font-medium"
          >
            View Profile
          </button>
        </div>

        {/* 3-Column Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:border-violet-500/50 transition-all group">
            <p className="text-xs font-bold text-violet-400 uppercase tracking-widest">Active Balance</p>
            <p className="text-4xl font-mono mt-3">{balance} <span className="text-lg text-gray-500">ETH</span></p>
            <div className="mt-4 h-1 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-violet-500 w-[70%]"></div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:border-green-500/50 transition-all">
            <p className="text-xs font-bold text-green-400 uppercase tracking-widest">Network Health</p>
            <div className="flex items-center mt-3">
              <span className="h-3 w-3 rounded-full bg-green-500 animate-pulse mr-3"></span>
              <p className="text-3xl font-mono capitalize">{network || "Mainnet"}</p>
            </div>
            <p className="text-sm text-gray-500 mt-2">Latency: 12ms</p>
          </div>

          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:border-orange-500/50 transition-all">
            <p className="text-xs font-bold text-orange-400 uppercase tracking-widest">Risk Prediction</p>
            <p className="text-3xl font-mono mt-3">{riskResult ? riskResult.level : "Pending"}</p>
            <p className="text-sm text-gray-500 mt-2">{riskResult ? `Score: ${riskResult.risk_score}` : "Run Analysis"}</p>
          </div>
        </div>

        {/* LLM Explanation Section */}
        {riskResult && riskResult.llm_explanation && (
          <div className="mb-8 p-6 rounded-3xl bg-violet-900/20 border border-violet-500/30 backdrop-blur-md">
            <h3 className="text-sm font-bold text-violet-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              AI Risk Analysis
            </h3>
            <p className="text-gray-300 leading-relaxed text-lg">
              {riskResult.llm_explanation}
            </p>
          </div>
        )}

        {/* Big Action Card */}
        <div className="bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border border-white/10 rounded-[40px] p-10 flex flex-col items-center text-center">
          <div className="h-16 w-16 bg-violet-500/20 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <h2 className="text-2xl font-bold mb-3">Ready to deploy capital?</h2>
          <p className="text-gray-400 max-w-lg mb-8">The AI engine has identified 3 new liquidity pools with an average APY of 14.2% on the {network} network.</p>
          <div className="flex gap-4 flex-wrap justify-center">
            <button
              onClick={handleComputeRisk}
              className="bg-violet-600 hover:bg-violet-700 px-8 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-violet-500/20"
            >
              Analyze Yields
            </button>
            <button
              onClick={handleDeposit}
              className="bg-green-500 hover:bg-green-600 px-8 py-3 rounded-2xl font-bold transition-all text-black"
            >
              Execute Trade (MetaMask)
            </button>
            <button onClick={logout} className="bg-white/5 hover:bg-white/10 px-8 py-3 rounded-2xl font-bold transition-all">Logout</button>
          </div>
        </div>
      </main>
    </div>
  );
}
