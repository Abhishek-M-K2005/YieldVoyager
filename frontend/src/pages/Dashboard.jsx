import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { computeRisk } from "../api/risk";
import { ethers } from "ethers";
import AppNavbar from "../components/AppNavbar";
import "../styles/Dashboard.css";

export default function Dashboard() {
  const { wallet, balance, network, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [riskResult, setRiskResult] = useState(null);

  const [greeting, setGreeting] = useState("Welcome");
  const [currentDate, setCurrentDate] = useState("");
  const [latency, setLatency] = useState(12);
  const [blockNumber, setBlockNumber] = useState(19428501);

  useEffect(() => {
    const updateTime = () => {
      const hour = new Date().getHours();
      if (hour < 12) setGreeting("Good Morning");
      else if (hour < 18) setGreeting("Good Afternoon");
      else setGreeting("Good Evening");

      const dateOptions = { weekday: 'long', month: 'short', day: 'numeric' };
      setCurrentDate(new Date().toLocaleDateString(undefined, dateOptions));
    };
    updateTime();

    const latencyInterval = setInterval(() => {
      setLatency(Math.floor(Math.random() * 16) + 8);
    }, 2500);

    const blockInterval = setInterval(() => {
      setBlockNumber(prev => prev + 1);
    }, 12000);

    return () => {
      clearInterval(latencyInterval);
      clearInterval(blockInterval);
    };
  }, []);

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
    <div className="dashboard-page">
      <AppNavbar onLogout={logout} />

      <main className="dashboard-main">
        <section className="dashboard-greeting-wrap">
          <p className="dashboard-status">System Status: Optimal</p>
          <h2 className="dashboard-greeting">
            {greeting}, <span>Voyager</span>
          </h2>
          <p className="dashboard-date">{currentDate}</p>
        </section>

        <div className="dashboard-grid">
          <article className="dashboard-balance-card">
            <div className="dashboard-curve-wrap">
              <svg viewBox="0 0 400 200" className="dashboard-curve">
                <path d="M0,150 Q50,130 100,160 T200,80 T300,120 T400,40" fill="none" stroke="#ff8c00" strokeWidth="4" />
              </svg>
            </div>

            <div className="dashboard-balance-head">
              <div className="dashboard-balance-rail" />
              <span>Active Balance</span>
            </div>

            <div className="dashboard-balance-value">
              {Number(balance || 0).toFixed(4)} ETH
              <small>+12.4%</small>
            </div>

            <div className="dashboard-balance-metrics">
              <div>
                <p>Network</p>
                <h4>{network || "mainnet"}</h4>
              </div>
              <div>
                <p>Ping</p>
                <h4>{latency}ms</h4>
              </div>
              <div>
                <p>Block</p>
                <h4>#{blockNumber.toLocaleString()}</h4>
              </div>
              <div>
                <p>Risk</p>
                <h4>{riskResult ? riskResult.level : "Pending"}</h4>
              </div>
            </div>
          </article>

          <aside className="dashboard-risk-card glass-hud">
            <span className="dashboard-chip">Risk Prediction</span>
            <p>{riskResult?.llm_explanation || "Market volatility is stable. Run analysis to generate a fresh score."}</p>
            <button onClick={handleComputeRisk}>{riskResult ? `View Analysis (${riskResult.risk_score})` : "Run Analysis"}</button>
          </aside>

          <article className="dashboard-network-card">
            <div className="dashboard-network-head">
              <h3>Network Health</h3>
              <span className="material-symbols-outlined">sensors</span>
            </div>
            <div className="dashboard-network-rows">
              <div><span>PING</span><strong>{latency}ms</strong></div>
              <div><span>BLOCK HEIGHT</span><strong>{blockNumber.toLocaleString()}</strong></div>
              <div><span>VALIDATORS</span><strong>1,402 Online</strong></div>
            </div>
            <div className="dashboard-progress"><div /></div>
          </article>

          <article className="dashboard-cta-card">
            <div>
              <h3>Ready to deploy capital?</h3>
              <p>3 new high-yield vaults opened with &gt;22% projected APY in the Arbitrum ecosystem.</p>
            </div>
            <div className="dashboard-cta-buttons">
              <button onClick={handleDeposit} className="primary">Deploy Now</button>
              <button onClick={() => navigate("/market")} className="secondary">Explore</button>
            </div>
          </article>
        </div>

        <section className="dashboard-telemetry">
          <div className="dashboard-telemetry-head">
            <h3>Live Telemetry</h3>
            <div />
          </div>

          <div className="dashboard-telemetry-list">
            <div>
              <div><span className="material-symbols-outlined">account_balance</span><p>Vault Deposit: USDC-ETH LP</p></div>
              <small>+$45,000.00 • 2 MIN AGO</small>
            </div>
            <div>
              <div><span className="material-symbols-outlined">auto_awesome</span><p>Auto-Compound Execution</p></div>
              <small>SYSTEM ACTION • 14 MIN AGO</small>
            </div>
            <div>
              <div><span className="material-symbols-outlined">sync_alt</span><p>Cross-chain Swap: SOL to ARB</p></div>
              <small>$12,400.00 • 1 HOUR AGO</small>
            </div>
          </div>
        </section>
      </main>

      <div className="dashboard-blob-left" />
      <div className="dashboard-blob-right" />
    </div>
  );
}