import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { TrendingUp, DollarSign, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function MarketToday() {
  const [marketData, setMarketData] = useState([]);
  const [topChains, setTopChains] = useState([]);
  const [vaults, setVaults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Global TVL History from DeFiLlama
        const tvlRes = await fetch("https://api.llama.fi/v2/historicalChainTvl");
        const tvlData = await tvlRes.json();
        
        // Format data for chart (last 30 days for cleaner view)
        const formattedTvl = tvlData.slice(-30).map(item => ({
          date: new Date(item.date * 1000).toLocaleDateString(undefined, {month:'short', day:'numeric'}),
          tvl: (item.tvl / 1e9).toFixed(2) // Convert to Billions
        }));
        setMarketData(formattedTvl);

        // 2. Fetch Top Chains
        const chainsRes = await fetch("https://api.llama.fi/v2/chains");
        const chainsData = await chainsRes.json();
        setTopChains(chainsData.slice(0, 5)); // Top 5 chains

        // 3. Fetch Yield Vaults (Backend)
        // const vaultsRes = await fetch("http://localhost:8000/api/defi/vaults/");
        // const vaultsData = await vaultsRes.json();
        // setVaults(vaultsData); 
        // Mocking for now as backend might be empty
        setVaults([
            { protocol: "Aave", asset: "USDC", apy: 4.5, tvl: "1.2B" },
            { protocol: "Curve", asset: "3pool", apy: 2.1, tvl: "400M" },
            { protocol: "MakerDAO", asset: "DAI", apy: 2.5, tvl: "5.1B" },
            { protocol: "Compound", asset: "ETH", apy: 3.2, tvl: "850M" },
            { protocol: "Lido", asset: "stETH", apy: 3.8, tvl: "32B" },
            { protocol: "Uniswap", asset: "V3 Pool", apy: 4.2, tvl: "2.8B" },
        ]);

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch market data", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-2">Market Overview</h1>
        <p className="text-gray-400 mb-8">Real-time DeFi insights powered by DeFiLlama.</p>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
           <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-lg">
             <div className="flex justify-between items-start mb-4">
               <div>
                 <p className="text-gray-400 text-sm">Total Value Locked</p>
                 <h3 className="text-2xl font-bold mt-1">$84.2B</h3>
               </div>
               <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
                 <DollarSign size={20} />
               </div>
             </div>
             <div className="flex items-center text-sm text-green-400">
               <ArrowUpRight size={16} className="mr-1" />
               <span>+2.4% (24h)</span>
             </div>
           </div>

           <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-lg">
             <div className="flex justify-between items-start mb-4">
               <div>
                 <p className="text-gray-400 text-sm">24h Volume</p>
                 <h3 className="text-2xl font-bold mt-1">$3.1B</h3>
               </div>
               <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                 <Activity size={20} />
               </div>
             </div>
             <div className="flex items-center text-sm text-gray-400">
               <span>Across all chains</span>
             </div>
           </div>

           <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-lg">
             <div className="flex justify-between items-start mb-4">
               <div>
                 <p className="text-gray-400 text-sm">Top Chain</p>
                 <h3 className="text-2xl font-bold mt-1">Ethereum</h3>
               </div>
               <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                 <TrendingUp size={20} />
               </div>
             </div>
             <div className="flex items-center text-sm text-purple-400">
               <span>58% Dominance</span>
             </div>
           </div>

           <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-lg">
             <div className="flex justify-between items-start mb-4">
               <div>
                 <p className="text-gray-400 text-sm">Active Protocols</p>
                 <h3 className="text-2xl font-bold mt-1">3,421</h3>
               </div>
               <div className="p-2 bg-orange-500/20 rounded-lg text-orange-400">
                 <Activity size={20} />
               </div>
             </div>
             <div className="flex items-center text-sm text-gray-400">
               <span>Tracked live</span>
             </div>
           </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Chart: TVL Trend */}
          <div className="lg:col-span-2 bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-lg">
            <h3 className="text-xl font-bold mb-6">Total Value Locked (30 Days)</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={marketData}>
                  <defs>
                    <linearGradient id="colorTvl" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}B`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="tvl" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorTvl)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Chains List */}
          <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-lg">
            <h3 className="text-xl font-bold mb-6">Top Chains by TVL</h3>
            <div className="space-y-4">
              {topChains.map((chain, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 font-mono text-sm">#{idx + 1}</span>
                    <span className="font-medium">{chain.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm">${(chain.tvl / 1e9).toFixed(1)}B</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Yield Opportunities */}
        <h2 className="text-2xl font-bold mb-6">Top Yield Opportunities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {vaults.map((vault, index) => (
            <div key={index} className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-violet-500/50 transition-all cursor-pointer group">
              <div className="flex justify-between items-start mb-4">
                <div className="h-10 w-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center font-bold text-xs">
                    {vault.protocol.substring(0,2)}
                </div>
                <div className="bg-green-500/10 text-green-400 px-2 py-1 rounded text-xs font-bold">
                  {vault.apy}% APY
                </div>
              </div>
              <h3 className="font-bold text-lg mb-1 group-hover:text-violet-400 transition-colors">{vault.protocol}</h3>
              <p className="text-gray-400 text-sm mb-4">{vault.asset} Strategy</p>
              
              <div className="flex justify-between text-xs text-gray-500 border-t border-white/5 pt-4">
                <span>TVL: {vault.tvl}</span>
                <span>Risk: Low</span>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}