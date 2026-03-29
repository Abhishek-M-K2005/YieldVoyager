import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { Shield, AlertTriangle, Brain, Activity } from 'lucide-react';
import AppNavbar from '../components/AppNavbar';
import '../styles/RiskPrediction.css';

export default function RiskPrediction() {
  const { wallet, balance } = useContext(AuthContext);
  const [protocols, setProtocols] = useState([]);
  const [selectedProtocol, setSelectedProtocol] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProtocols = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        
        const response = await fetch("http://localhost:8000/api/defi/protocols/", { headers });
        if (response.ok) {
          const data = await response.json();
          setProtocols(data);
          if (data.length > 0) setSelectedProtocol(data[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch protocols:", err);
      }
    };
    fetchProtocols();
  }, []);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!selectedProtocol) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const token = localStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`http://localhost:8000/api/risk/protocol/${selectedProtocol}/`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          wallet_address: wallet,
          wallet_balance: balance || "0.0"
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Analysis failed");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const riskFactors = [
    { subject: 'Smart Contract', A: 80, fullMark: 100 },
    { subject: 'Liquidity', A: 65, fullMark: 100 },
    { subject: 'Centralization', A: 40, fullMark: 100 },
    { subject: 'Volatility', A: 90, fullMark: 100 },
    { subject: 'Audit', A: 70, fullMark: 100 },
  ];

  return (
    <div className="risk-page">
      <AppNavbar />

      <main className="risk-main-shell">
        <div className="space-y-8">
          <div className="risk-header-wrapper">
            <div>
              <p className="risk-kicker">System Diagnostic</p>
              <h1 className="risk-title">AI Risk Prediction <span>Engine</span></h1>
              <p className="risk-subtitle">Select a protocol to run a comprehensive risk analysis using our ML models.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="space-y-8 lg:col-span-4">
              <div className="risk-input-panel glass-card">
                <div className="status-accent bg-primary"></div>
                <h2 className="input-title">
                <Activity className="w-5 h-5 text-blue-400" />
                Analysis Parameters
              </h2>
              
              <form onSubmit={handleAnalyze} className="space-y-6">
                <div>
                  <label className="form-label">Select Protocol</label>
                  <select
                    value={selectedProtocol}
                    onChange={(e) => setSelectedProtocol(e.target.value)}
                    className="form-select"
                  >
                    {protocols.map((p) => (
                        <option key={p.id} value={p.id}>{p.name} ({p.chain})</option>
                    ))}
                    {protocols.length === 0 && <option value="">Loading protocols...</option>}
                  </select>
                </div>

                <div>
                   <label className="form-label">Your Context</label>
                  <div className="context-box">
                    <div className="context-row mb-1">
                        <span className="text-gray-500">Wallet</span>
                        <span className="text-gray-300 font-mono truncate w-24">{wallet || "Not Connected"}</span>
                    </div>
                    <div className="context-row">
                        <span className="text-gray-500">Balance</span>
                        <span className="text-gray-300">{balance ? parseFloat(balance).toFixed(4) : "0.00"} ETH</span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !selectedProtocol}
                  className={`submit-btn ${loading ? 'loading-state' : 'active-state'}`}
                >
                  {loading ? (
                    <>
                       <div className="spinner-icon" /> Running ML Models...
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5" /> Analyze Risk
                    </>
                  )}
                </button>
                
                {error && (
                  <div className="error-box">
                    <AlertTriangle className="w-5 h-5 shrink-0" /> {error}
                  </div>
                )}
              </form>
              </div>

              <div className="relative rounded-2xl glass-card p-8">
                <div className="status-accent bg-surface-variant"></div>
                <h3 className="mb-6 font-label text-[0.75rem] uppercase tracking-widest text-zinc-500">Recent Telemetry</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between"><span className="text-sm">Curve Stables</span><span className="font-label text-[10px] text-zinc-500">2M AGO</span></div>
                  <div className="flex items-center justify-between opacity-60"><span className="text-sm">Lido stETH</span><span className="font-label text-[10px] text-zinc-500">4H AGO</span></div>
                  <div className="flex items-center justify-between opacity-40"><span className="text-sm">Uniswap V3</span><span className="font-label text-[10px] text-zinc-500">1D AGO</span></div>
                </div>
              </div>
            </div>

            <div className="space-y-8 lg:col-span-8">
                {!result ? (
                    <div className="empty-results-box">
                        <Brain className="empty-results-icon" />
                        <p>Select a protocol and run analysis to see AI insights</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            <div className="score-card">
                                 <div className="score-shield-bg">
                                    <Shield className="w-32 h-32" />
                                 </div>
                                 <h3 className="text-gray-400 font-medium mb-1">Overall Risk Score</h3>
                                 <div className="score-display">
                                    <span className={`score-value ${
                                        result.risk_score < 4 ? 'text-green-400' :
                                        result.risk_score < 7 ? 'text-yellow-400' : 'text-red-500'
                                    }`}>
                                        {result.risk_score}/10
                                    </span>
                                    <span className={`score-badge ${
                                        result.level === 'low' ? 'bg-green-900/30 text-green-400 border border-green-800' :
                                        result.level === 'medium' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-800' :
                                        'bg-red-900/30 text-red-400 border border-red-800'
                                    }`}>
                                        {result.level} Risk
                                    </span>
                                 </div>
                                
                                <div className="radar-chart-container">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={riskFactors}>
                                        <PolarGrid stroke="#374151" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                        <Radar name="Project" dataKey="A" stroke="#3B82F6" strokeWidth={2} fill="#3B82F6" fillOpacity={0.3} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }} itemStyle={{ color: '#F3F4F6' }} />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="rounded-2xl glass-card p-8">
                                <h3 className="text-gray-400 font-medium">Risk Factors</h3>
                                <div className="space-y-3">
                                    {['Audit Verified', 'High TVL', 'Open Source'].map((item, i) => (
                                        <div key={i} className="factor-item">
                                            <div className="factor-dot bg-green-500" /> {item}
                                        </div>
                                    ))}
                                     <div className="factor-item border border-yellow-900/30">
                                        <div className="factor-dot bg-yellow-500" /> New Protocol (&lt; 6mo)
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl glass-card p-8">
                            <div className="llm-header-wrapper">
                                <div className="llm-icon-bg">
                                    <Brain className="w-6 h-6 text-blue-400" />
                                </div>
                                <h3 className="llm-title">AI Risk Analysis</h3>
                            </div>
                            
                            <div className="prose prose-invert max-w-none">
                                <p className="llm-paragraph">
                                    {result.llm_explanation || "No explanation available."}
                                </p>
                            </div>
                            
                            <div className="llm-footer">
                                <span>Analysis generated by YieldVoyager LLM Engine</span>
                                <span>Model Date: {new Date().toLocaleDateString()}</span>
                            </div>
                        </div>
                    </>
                )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}