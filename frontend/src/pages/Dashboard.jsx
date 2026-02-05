import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function Dashboard() {
  const { balance, network, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Top Action Bar */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Cryptic <span className="text-violet-500">Pulse</span></h1>
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
            <p className="text-3xl font-mono mt-3">Moderate</p>
            <p className="text-sm text-gray-500 mt-2">Confidence: 94.2%</p>
          </div>
        </div>

        {/* Big Action Card */}
        <div className="bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border border-white/10 rounded-[40px] p-10 flex flex-col items-center text-center">
          <div className="h-16 w-16 bg-violet-500/20 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <h2 className="text-2xl font-bold mb-3">Ready to deploy capital?</h2>
          <p className="text-gray-400 max-w-lg mb-8">The AI engine has identified 3 new liquidity pools with an average APY of 14.2% on the {network} network.</p>
          <div className="flex gap-4">
            <button className="bg-violet-600 hover:bg-violet-700 px-8 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-violet-500/20">Analyze Yields</button>
            <button onClick={logout} className="bg-white/5 hover:bg-white/10 px-8 py-3 rounded-2xl font-bold transition-all">Logout</button>
          </div>
        </div>
      </main>
    </div>
  );
}
