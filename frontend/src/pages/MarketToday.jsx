import React, { useState, useEffect } from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { TrendingUp, DollarSign, Activity, ArrowUpRight } from 'lucide-react';
import AppNavbar from '../components/AppNavbar';
import '../styles/MarketToday.css';

export default function MarketToday() {
  const [marketData, setMarketData] = useState([]);
  const [topChains, setTopChains] = useState([]);
  const [vaults, setVaults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tvlRes = await fetch("https://api.llama.fi/v2/historicalChainTvl");
        const tvlData = await tvlRes.json();
        
        const formattedTvl = tvlData.slice(-30).map(item => ({
          date: new Date(item.date * 1000).toLocaleDateString(undefined, {month:'short', day:'numeric'}),
          tvl: (item.tvl / 1e9).toFixed(2) 
        }));
        setMarketData(formattedTvl);

        const chainsRes = await fetch("https://api.llama.fi/v2/chains");
        const chainsData = await chainsRes.json();
        setTopChains(chainsData.slice(0, 5)); 

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
    <div className="market-page">
      <AppNavbar />

      <main className="market-main-shell">
        <section className="mb-16 grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <label className="market-kicker">Ecosystem Status</label>
            <h1 className="market-title-hero">Market Today</h1>
            <div className="market-hero-chart solar-glow">
              <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-6">
                <div>
                  <p className="font-label text-[10px] uppercase tracking-widest text-zinc-500">30D TVL Trend</p>
                  <p className="mt-1 text-3xl font-headline font-bold">$12.84B</p>
                </div>
                <span className="w-fit rounded-full bg-primary/10 px-3 py-1 font-label text-[10px] font-bold text-primary">+12.4%</span>
              </div>

              <div className="absolute inset-x-0 bottom-0 h-[70%]">
                <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 1000 300">
                  <defs>
                    <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#ff8c00" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#ff8c00" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0,280 Q100,250 200,270 T400,220 T600,240 T800,150 T1000,100 L1000,300 L0,300 Z" fill="url(#chartFill)" />
                  <path d="M0,280 Q100,250 200,270 T400,220 T600,240 T800,150 T1000,100" fill="none" stroke="#ff8c00" strokeWidth="3" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:col-span-4">
            <div className="rounded-xl border-l-2 border-secondary bg-surface-container-high p-6">
              <p className="mb-1 font-label text-[10px] uppercase tracking-widest text-secondary">24h Volume</p>
              <p className="text-3xl font-headline font-medium">$842.1M</p>
            </div>
            <div className="rounded-xl border-l-2 border-outline-variant bg-surface-container-high p-6">
              <p className="mb-1 font-label text-[10px] uppercase tracking-widest text-zinc-500">Top Chain</p>
              <p className="text-3xl font-headline font-medium">Ethereum</p>
            </div>
            <div className="rounded-xl border-l-2 border-primary bg-surface-container-high p-6">
              <p className="mb-1 font-label text-[10px] uppercase tracking-widest text-primary">Active Vaults</p>
              <p className="text-3xl font-headline font-medium">1,204</p>
            </div>
          </div>
        </section>

        <div className="metric-grid">
           <div className="metric-card">
             <div className="metric-card-header">
               <div>
                 <p className="metric-label">Total Value Locked</p>
                 <h3 className="metric-value">$84.2B</h3>
               </div>
               <div className="metric-icon-bg bg-green-500/20 text-green-400">
                 <DollarSign size={20} />
               </div>
             </div>
             <div className="metric-footer text-green-400">
               <ArrowUpRight size={16} className="mr-1" />
               <span>+2.4% (24h)</span>
             </div>
           </div>

           <div className="metric-card">
             <div className="metric-card-header">
               <div>
                 <p className="metric-label">24h Volume</p>
                 <h3 className="metric-value">$3.1B</h3>
               </div>
               <div className="metric-icon-bg bg-blue-500/20 text-blue-400">
                 <Activity size={20} />
               </div>
             </div>
             <div className="metric-footer text-gray-400">
               <span>Across all chains</span>
             </div>
           </div>

           <div className="metric-card">
             <div className="metric-card-header">
               <div>
                 <p className="metric-label">Top Chain</p>
                 <h3 className="metric-value">Ethereum</h3>
               </div>
               <div className="metric-icon-bg bg-purple-500/20 text-purple-400">
                 <TrendingUp size={20} />
               </div>
             </div>
             <div className="metric-footer text-purple-400">
               <span>58% Dominance</span>
             </div>
           </div>

           <div className="metric-card">
             <div className="metric-card-header">
               <div>
                 <p className="metric-label">Active Protocols</p>
                 <h3 className="metric-value">3,421</h3>
               </div>
               <div className="metric-icon-bg bg-orange-500/20 text-orange-400">
                 <Activity size={20} />
               </div>
             </div>
             <div className="metric-footer text-gray-400">
               <span>Tracked live</span>
             </div>
           </div>
        </div>

        <div className="charts-grid">
          <div className="chart-wrapper lg:col-span-2">
            <h3 className="chart-title">Total Value Locked (30 Days)</h3>
            <div className="chart-container">
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

          <div className="chart-wrapper">
            <h3 className="chart-title">Top Chains by TVL</h3>
            <div className="chains-list">
              {topChains.map((chain, idx) => (
                <div key={idx} className="chain-item">
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

        <h2 className="mb-6 text-2xl font-headline font-bold text-primary">Top Yield Opportunities</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {vaults.map((vault, index) => (
            <div key={index} className="vault-card group">
              <div className="vault-card-header">
                <div className="vault-icon">
                    {vault.protocol.substring(0,2)}
                </div>
                <div className="vault-apy">
                  {vault.apy}% APY
                </div>
              </div>
              <h3 className="vault-name">{vault.protocol}</h3>
              <p className="vault-strategy">{vault.asset} Strategy</p>
              
              <div className="vault-footer">
                <span>TVL: {vault.tvl}</span>
                <span>Risk: Low</span>
              </div>
            </div>
          ))}
        </div>

        <div className="market-command-hud glass-card">
          <div>
            <h3>Voyager Alpha Channel</h3>
            <p>Receive real-time notifications when high-yield vaults are deployed or volatility exceeds your threshold.</p>
          </div>
          <div>
            <button className="secondary">Learn More</button>
            <button className="primary">Enable Alerts</button>
          </div>
        </div>

      </main>
    </div>
  );
}