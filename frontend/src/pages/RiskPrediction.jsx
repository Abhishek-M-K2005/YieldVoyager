import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Header';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { Shield, AlertTriangle, Check, Brain, Activity, TrendingUp, Globe } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function RiskPrediction() {
  const { wallet, balance } = useContext(AuthContext);
  const [protocols, setProtocols] = useState([]);
  const [selectedProtocol, setSelectedProtocol] = useState("");

  // New States for User Preferences
  const [riskTolerance, setRiskTolerance] = useState("medium");
  const [investmentGoal, setInvestmentGoal] = useState("Long-term Growth");

  // Model Selection State
  const [selectedModel, setSelectedModel] = useState("aggregate");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch available protocols
    const fetchProtocols = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        const response = await fetch("http://localhost:8000/api/defi/protocols/", {
          headers
        });
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
    setSelectedModel("aggregate");

    try {
      const token = localStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`http://localhost:8000/api/risk/protocol/${selectedProtocol}/`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          wallet_address: wallet,
          wallet_balance: balance || "0.0",
          risk_tolerance: riskTolerance,
          investment_goal: investmentGoal
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

  const handleAnalyzeAll = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    setSelectedModel("aggregate");

    try {
      const token = localStorage.getItem('token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`http://localhost:8000/api/risk/best_protocol/`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          wallet_address: wallet,
          wallet_balance: balance || "0.0",
          risk_tolerance: riskTolerance,
          investment_goal: investmentGoal
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Analysis failed");
      }

      const data = await response.json();
      // Map it to result shape so the UI can render it
      setResult({
        is_overall: true,
        recommended_protocol: data.recommended_protocol,
        risk_score: data.best_score,
        level: data.best_score < 4 ? "low" : data.best_score < 7 ? "medium" : "high",
        llm_explanation: data.llm_explanation,
        all_scores: data.all_scores
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Compute Active Display Score
  const displayScore = result ? result.risk_score : 0;
  const displayLevel = displayScore < 4 ? 'low' : displayScore < 7 ? 'medium' : 'high';

  // Mock data for radar chart visualization of risk factors
  const riskFactors = [
    { subject: 'Smart Contract', A: 80, fullMark: 100 },
    { subject: 'Liquidity', A: 65, fullMark: 100 },
    { subject: 'Centralization', A: 40, fullMark: 100 },
    { subject: 'Volatility', A: 90, fullMark: 100 },
    { subject: 'Audit', A: 70, fullMark: 100 },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="space-y-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-100 mb-2">AI Risk Prediction Engine</h1>
              <p className="text-gray-400">Select a protocol to run a comprehensive multi-model risk analysis.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Section */}
            <div className="lg:col-span-1 bg-gray-800 rounded-xl p-6 border border-gray-700 h-fit">
              <h2 className="text-xl font-semibold text-gray-100 mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-400" />
                Analysis Parameters
              </h2>

              <form className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Your Context
                  </label>
                  <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Balance</span>
                      <span className="text-gray-300 font-mono">{balance ? parseFloat(balance).toFixed(4) : "0.00"} ETH</span>
                    </div>
                    {/* New Inputs */}
                    <div className="space-y-1">
                      <span className="text-gray-500 text-xs uppercase">Risk Tolerance</span>
                      <select
                        value={riskTolerance}
                        onChange={(e) => setRiskTolerance(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white"
                      >
                        <option value="low">Low (Conservative)</option>
                        <option value="medium">Medium (Moderate)</option>
                        <option value="high">High (Aggressive)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <span className="text-gray-500 text-xs uppercase">Investment Goal</span>
                      <select
                        value={investmentGoal}
                        onChange={(e) => setInvestmentGoal(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-sm text-white"
                      >
                        <option value="Long-term Growth">Long-term Growth</option>
                        <option value="Yield Farming">Yield Farming</option>
                        <option value="Stable Income">Stable Income</option>
                        <option value="Speculative Trading">Speculative Trading</option>
                        <option value="Capital Preservation">Capital Preservation</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2 mt-4">
                    Target Protocol
                  </label>
                  <select
                    value={selectedProtocol}
                    onChange={(e) => setSelectedProtocol(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                  >
                    {protocols.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.chain})
                      </option>
                    ))}
                    {protocols.length === 0 && <option value="">Loading protocols...</option>}
                  </select>
                </div>

                <div className="pt-4 space-y-3">
                  <button
                    onClick={handleAnalyze}
                    disabled={loading || !selectedProtocol}
                    className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors duration-200 flex items-center justify-center gap-2
                      ${loading
                        ? 'bg-blue-600/50 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-lg shadow-blue-900/20'
                      }`}
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Brain className="w-5 h-5" />
                    )}
                    Analyze Selected Protocol
                  </button>

                  <button
                    onClick={handleAnalyzeAll}
                    disabled={loading || protocols.length === 0}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2 border
                      ${loading
                        ? 'bg-transparent border-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-transparent hover:bg-white/5 border-violet-500/50 text-violet-400 hover:text-violet-300'
                      }`}
                  >
                    <Globe className="w-5 h-5" />
                    Find Best Protocol Overall
                  </button>
                </div>

                {error && (
                  <div className="p-4 bg-red-900/30 border border-red-800 rounded-lg flex items-start gap-3 text-red-200 text-sm">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                    {error}
                  </div>
                )}
              </form>
            </div>

            {/* Results Section */}
            <div className="lg:col-span-2 space-y-6">
              {!result ? (
                <div className="bg-gray-800/50 border border-gray-700 border-dashed rounded-xl h-96 flex flex-col items-center justify-center text-gray-500">
                  <Brain className="w-16 h-16 mb-4 opacity-20" />
                  <p>Run analysis to see AI insights via Chroma RAG constraints</p>
                </div>
              ) : (
                <>
                  {/* Score Card */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 bg-gray-800 rounded-xl p-6 border border-gray-700 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Shield className="w-32 h-32" />
                      </div>
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-gray-400 font-medium">{result.is_overall ? "Top Recommended Protocol" : "Aggregate AI Risk Score"}</h3>
                      </div>

                      {result.is_overall && (
                        <h2 className="text-3xl font-bold text-violet-400 mb-2 truncate">{result.recommended_protocol}</h2>
                      )}

                      <div className="flex items-baseline gap-4 mb-4">
                        <span className={`text-5xl font-bold ${displayScore < 4 ? 'text-green-400' :
                          displayScore < 7 ? 'text-yellow-400' : 'text-red-500'
                          }`}>
                          {displayScore}/10
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium uppercase tracking-wider ${displayLevel === 'low' ? 'bg-green-900/30 text-green-400 border border-green-800' :
                          displayLevel === 'medium' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-800' :
                            'bg-red-900/30 text-red-400 border border-red-800'
                          }`}>
                          {displayLevel} Risk
                        </span>
                      </div>

                      <div className="h-64 mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={riskFactors}>
                            <PolarGrid stroke="#374151" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                            <Radar
                              name="Project"
                              dataKey="A"
                              stroke={displayLevel === 'high' ? '#EF4444' : displayLevel === 'medium' ? '#EAB308' : '#3B82F6'}
                              strokeWidth={2}
                              fill={displayLevel === 'high' ? '#EF4444' : displayLevel === 'medium' ? '#EAB308' : '#3B82F6'}
                              fillOpacity={0.3}
                            />
                            <Tooltip
                              contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                              itemStyle={{ color: '#F3F4F6' }}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Quick Stats or Key Flags */}
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 flex flex-col gap-4">
                      <h3 className="text-gray-400 font-medium">Risk Factors</h3>
                      <div className="space-y-3">
                        {['Audit Verified', 'High TVL', 'Open Source'].map((item, i) => (
                          <div key={i} className="flex items-center gap-3 text-sm text-gray-300 bg-gray-900/50 p-3 rounded-lg">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            {item}
                          </div>
                        ))}
                        {displayLevel === 'high' && (
                          <div className="flex items-center gap-3 text-sm text-red-300 bg-red-900/20 p-3 rounded-lg border border-red-900/50">
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                            Volatile TVL Drops
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Individual Models Grid */}
                  {!result.is_overall && result.individual_model_scores && Object.keys(result.individual_model_scores).length > 0 && (
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                      <h3 className="text-gray-400 font-medium mb-4 flex items-center gap-2">
                        <Brain className="w-5 h-5 text-blue-400" />
                        Underlying Models Breakdown
                      </h3>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {Object.entries(result.individual_model_scores).map(([name, val]) => (
                          <div key={name} className="bg-gray-900 p-4 rounded-lg flex flex-col items-center justify-center border border-gray-700 shadow shadow-black/50">
                            <span className="text-xs font-semibold text-gray-400 mb-2 truncate w-full text-center" title={name}>{name}</span>
                            <span className={`text-xl font-bold ${(val * 10) < 4 ? 'text-green-500' : (val * 10) < 7 ? 'text-yellow-500' : 'text-red-500'}`}>
                              {(val * 10).toFixed(1)}/10
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI Explanation */}
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 border border-blue-900/30 shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Brain className="w-6 h-6 text-blue-400" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-100">
                        {result.is_overall ? "AI Ecosystem Recommendation" : "AI Risk Analysis"}
                      </h3>
                    </div>

                    <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-headings:mb-4 prose-headings:mt-6 first:prose-headings:mt-0">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {result.llm_explanation || "No explanation available."}
                      </ReactMarkdown>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-700/50 text-xs text-gray-500 flex justify-between items-center">
                      <span>Analysis generated by LLM via ChromaDB RAG constraints</span>
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
