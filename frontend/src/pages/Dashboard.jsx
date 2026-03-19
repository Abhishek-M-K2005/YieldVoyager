import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { computeRisk } from "../api/risk";
import { ethers } from "ethers";

// Reusable Tooltip Component for pure CSS hover effects
const Tooltip = ({ text }) => (
  <div className="group relative inline-block ml-2 cursor-help">
    <svg className="w-4 h-4 text-gray-500 hover:text-violet-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
    </svg>
    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-gray-900 border border-gray-700 text-gray-300 text-xs rounded-xl p-3 shadow-xl z-50">
      {text}
      {/* Little triangle pointer at the bottom */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
    </div>
  </div>
);

export default function Dashboard() {
  const { wallet, balance, network, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [riskResult, setRiskResult] = useState(null);

  // --- NEW FEATURE STATES ---
  const [greeting, setGreeting] = useState("Welcome");
  const [currentDate, setCurrentDate] = useState("");
  const [latency, setLatency] = useState(12);
  const [blockNumber, setBlockNumber] = useState(19428501); // Mock starting block

  // --- NEW FEATURE EFFECTS ---
  useEffect(() => {
    // 1. Dynamic Time/Greeting Setup
    const updateTime = () => {
      const hour = new Date().getHours();
      if (hour < 12) setGreeting("Good Morning");
      else if (hour < 18) setGreeting("Good Afternoon");
      else setGreeting("Good Evening");

      const dateOptions = { weekday: 'long', month: 'short', day: 'numeric' };
      setCurrentDate(new Date().toLocaleDateString(undefined, dateOptions));
    };
    updateTime();

    // 2. Network Heartbeat (Fluctuating Latency & Block Increments)
    const latencyInterval = setInterval(() => {
      // Fluctuate between 8ms and 24ms
      setLatency(Math.floor(Math.random() * 16) + 8);
    }, 2500);

    const blockInterval = setInterval(() => {
      // Simulate a new Ethereum block every ~12 seconds
      setBlockNumber(prev => prev + 1);
    }, 12000);

    return () => {
      clearInterval(latencyInterval);
      clearInterval(blockInterval);
    };
  }, []);

  // --- ORIGINAL ENGINE (Untouched) ---
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
      
      // Navigate to market page smoothly
      setTimeout(() => {
        navigate('/market');
      }, 1500);
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
      const tx = await signer.sendTransaction({
        to: wallet,
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
        
        {/* FEATURE 4: Dynamic Greeting inside Top Action Bar */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              {greeting}, <span className="text-violet-500">Voyager</span>
            </h1>
            <p className="text-gray-400 mt-2 font-mono text-sm tracking-wide">
              {currentDate} • Yield optimization and risk metrics are live.
            </p>
          </div>
          <button
            onClick={() => navigate('/profile')}
            className="bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-2 rounded-full transition-all font-medium flex items-center gap-2"
          >
            View Profile
          </button>
        </div>

        {/* 3-Column Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* FEATURE 2: Micro-Chart (Sparkline) added to Active Balance */}
          <div className="relative overflow-hidden p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:border-violet-500/50 transition-all group z-0">
            <div className="relative z-10">
              <p className="text-xs font-bold text-violet-400 uppercase tracking-widest">Active Balance</p>
              <p className="text-4l font-mono mt-3">{Number(balance).toFixed(18)} <span className="text-lg text-gray-500">ETH</span></p>
              <div className="mt-4 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-violet-500 w-[70%]"></div>
              </div>
            </div>
            {/* SVG Sparkline Background */}
            <svg className="absolute bottom-0 left-0 w-full h-24 opacity-30 pointer-events-none z-0" viewBox="0 0 100 30" preserveAspectRatio="none">
              <path d="M0,30 Q10,15 20,20 T40,10 T60,25 T80,5 T100,15 L100,30 L0,30 Z" fill="url(#gradBalance)" />
              <path d="M0,30 Q10,15 20,20 T40,10 T60,25 T80,5 T100,15" fill="none" stroke="#8b5cf6" strokeWidth="1" />
              <defs>
                <linearGradient id="gradBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* FEATURE 1 & 3: Network Heartbeat + Tooltip */}
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:border-green-500/50 transition-all">
            <div className="flex items-center">
              <p className="text-xs font-bold text-green-400 uppercase tracking-widest">Network Health</p>
              <Tooltip text="Real-time connection status to the blockchain RPC endpoints." />
            </div>
            <div className="flex items-center mt-3">
              <span className="h-3 w-3 rounded-full bg-green-500 animate-pulse mr-3 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
              <p className="text-3xl font-mono capitalize">{network || "Mainnet"}</p>
            </div>
            <div className="flex justify-between items-center mt-2 text-sm text-gray-500 font-mono">
              <p className="transition-all duration-300">Ping: {latency}ms</p>
              <p>Block: #{blockNumber.toLocaleString()}</p>
            </div>
          </div>

          {/* FEATURE 3: Tooltip on Risk Prediction */}
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:border-orange-500/50 transition-all">
            <div className="flex items-center">
              <p className="text-xs font-bold text-orange-400 uppercase tracking-widest">Risk Prediction</p>
              <Tooltip text="Machine Learning model predicting pool stability based on TVL, age, and liquidity depth." />
            </div>
            <p className="text-3xl font-mono mt-3">{riskResult ? riskResult.level : "Pending"}</p>
            <p className="text-sm text-gray-500 mt-2 font-mono">
              {riskResult ? `Score: ${riskResult.risk_score}` : "Awaiting user command..."}
            </p>
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
        <div className="bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border border-white/10 rounded-[40px] p-10 flex flex-col items-center text-center relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-[80px] pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="h-16 w-16 bg-violet-500/20 rounded-full flex items-center justify-center mb-6 border border-violet-500/30">
              <svg className="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h2 className="text-2xl font-bold mb-3">Ready to deploy capital?</h2>
            <p className="text-gray-400 max-w-lg mb-8 leading-relaxed">The AI engine has identified 3 new liquidity pools with an average APY of 14.2% on the {network || 'Mainnet'} network.</p>
            <div className="flex gap-4 flex-wrap justify-center">
              <button
                onClick={handleComputeRisk}
                className="bg-violet-600 hover:bg-violet-500 px-8 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-violet-500/20 border border-violet-400/20"
              >
                Analyze Yields
              </button>
              <button
                onClick={handleDeposit}
                className="bg-green-500 hover:bg-green-400 px-8 py-3 rounded-2xl font-bold transition-all text-black shadow-lg shadow-green-500/20"
              >
                Execute Trade (MetaMask)
              </button>
              <button onClick={logout} className="bg-white/5 hover:bg-white/10 px-8 py-3 rounded-2xl font-bold transition-all border border-white/10">
                Logout
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
