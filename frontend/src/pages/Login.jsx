import { ethers } from "ethers";
import { getNonce, verifySignature } from "../api/auth";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isConnecting, setIsConnecting] = useState(false);
  const [walletMissing, setWalletMissing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const connectWallet = async () => {
    setErrorMessage("");
    if (!window.ethereum) {
      setWalletMissing(true);
      return;
    }
    setIsConnecting(true);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      if (network.chainId !== 1n) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x1' }],
          });
        } catch (switchError) {
          throw new Error("Network switch rejected. YieldVoyager requires Ethereum Mainnet to fetch live data.");
        }
      }

      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const { nonce } = await getNonce(address);
      const signature = await signer.signMessage(nonce);
      const tokens = await verifySignature(address, signature);

      login(tokens.access, address);
      navigate("/dashboard");

    } catch (error) {
      if (error.code === 4001 || error.code === 'ACTION_REJECTED') {
        setErrorMessage("Signature request rejected. Please try again.");
      } else {
        console.error("Login failed:", error);
        setErrorMessage(error.message || "Login failed. Please check your wallet.");
      }
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-ambient" />
      <div className="login-blob login-blob-top" />
      <div className="login-blob login-blob-bottom" />

      <main className="login-main">
        <div className="login-branding">
          <div className="login-branding-orb-wrap">
            <div className="login-branding-orb-glow" />
            <div className="login-branding-orb">
              <span className="material-symbols-outlined">bolt</span>
            </div>
          </div>
          <h1 className="login-brand-title">YieldVoyager</h1>
        </div>

        <div className="login-card">
          <div className="login-status-rail" />

          <header className="login-card-header">
            <p className="login-card-kicker">Telemetry Online</p>
            <h2 className="login-card-title">
              Welcome <span>Back</span>
            </h2>
            <p className="login-card-copy">
              Reconnect your orbital terminal to access automated yield vault strategies across the stellar network.
            </p>
          </header>

          <div className="login-actions">
            {walletMissing ? (
              <div className="wallet-missing-box">
                <p>MetaMask is not detected.</p>
                <a href="https://metamask.io/download/" target="_blank" rel="noreferrer" className="install-btn">
                  Install MetaMask
                </a>
              </div>
            ) : (
              <button onClick={connectWallet} disabled={isConnecting} className="login-primary-btn">
                <div className="login-primary-btn-left">
                  <div className="login-primary-btn-icon">
                    <span className="material-symbols-outlined">account_balance_wallet</span>
                  </div>
                  <div>
                    <span className="login-primary-btn-title">{isConnecting ? "Connecting..." : "Connect MetaMask"}</span>
                    <span className="login-primary-btn-subtitle">Secure RPC Node</span>
                  </div>
                </div>
                {isConnecting ? (
                  <svg className="login-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <span className="material-symbols-outlined login-primary-btn-arrow">arrow_forward</span>
                )}
              </button>
            )}

            <div className="login-secondary-grid">
              <button className="login-secondary-btn" type="button">
                <span className="material-symbols-outlined">qr_code_2</span>
                <span>WalletConnect</span>
              </button>
              <button className="login-secondary-btn" type="button">
                <span className="material-symbols-outlined">key</span>
                <span>Email Key</span>
              </button>
            </div>

            {errorMessage ? <p className="error-message">{errorMessage}</p> : null}
          </div>

          <footer className="login-card-footer">
            <span className="material-symbols-outlined">info</span>
            <p>
              By connecting, you authorize YieldVoyager to interact with your public address via Ethereum Mainnet. Protocol
              interactions are non-custodial.
            </p>
          </footer>
        </div>

        <div className="login-terminal-status">
          <div>
            <span className="login-dot" />
            <span>Chain: Mainnet-01</span>
          </div>
          <div>
            <span className="material-symbols-outlined">speed</span>
            <span>Gas: 14 Gwei</span>
          </div>
          <div>
            <span className="material-symbols-outlined">sensors</span>
            <span>Latency: 22ms</span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;