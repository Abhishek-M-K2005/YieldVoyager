import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Header from "../components/Header";
import { computeRisk } from "../api/risk"
import { useState } from "react";


function Dashboard() {
  const { logout } = useContext(AuthContext);
  const [riskResult, setRiskResult] =useState(null);
  const handleComputeRisk = async () => {
    try {
      const metrics = {
        tvl_change_24h: -0.05,
        tvl_change_7d: -0.12,
        liquidity_depth: 1000000,
        utilization_ratio:0.65,
        oracle_price_std: 0.08,
        liquidation_spike_ratio: 1.3,
        protocol_age_days: 600,
        audit_count: 3
      };

      const result = await computeRisk(1, metrics);
      setRiskResult(result);
    } catch (error) {
      console.error("Risk computation failed:", error);
    }
  };

  return (
    <div className="bg-[#131314]">
      <Header/>

    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-10">
  <div className="relative isolate">
    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/50 to-blue-500/40 blur-3xl opacity-70"></div>
    
    <div className="relative rounded-xl border border-white/10 bg-gray-800/60 p-10 flex flex-col items-center shadow-2xl backdrop-blur-sm">
      <h2 className="text-3xl font-semibold text-white mb-4">Dashboard</h2>
      <p className="text-gray-300 max-w-sm text-center">
        Welcome to Yield Voyager. Your Wallet has be verified.
      </p>
      <button className="mt-6 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300" onClick={logout}>Logout</button>
      
      <button className="mt-4 px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg=purple-700 transition duration-300"
      onClick={handleComputeRisk}>
        Compute Risk
      </button>

      {riskResult && (
        <div className="mt-6 text-white text-center">
          <p> Risk Score: {riskResult.risk_score}</p>
          <p> Risk Level: {riskResult.level}</p>
        </div>
      )}
    </div>
  </div>
</div>
    </div>
  );
}

export default Dashboard;
