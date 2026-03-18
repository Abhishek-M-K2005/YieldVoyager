import { ethers } from "ethers";
import { getNonce, verifySignature } from "../api/auth";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // New state variables for pro-level UX
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletMissing, setWalletMissing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const connectWallet = async () => {
    setErrorMessage(""); // Clear old errors

    // FEATURE 1: Graceful missing wallet check
    if (!window.ethereum) {
      setWalletMissing(true);
      return;
    }

    setIsConnecting(true); // Start the loading animation

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);

      // FEATURE 2: Auto-Network Checker (Forces Ethereum Mainnet)
      const network = await provider.getNetwork();
      if (network.chainId !== 1n) { // 1n is Mainnet in ethers v6
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x1' }], // 0x1 is the hex code for Mainnet
          });
        } catch (switchError) {
          throw new Error("Network switch rejected. YieldVoyager requires Ethereum Mainnet to fetch live data.");
        }
      }

      // THE ORIGINAL ENGINE (Untouched)
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
      setIsConnecting(false); // Stop the loading animation no matter what
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0f172a] flex flex-col justify-center items-center overflow-hidden font-sans">
      
      {/* Ambient Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-fuchsia-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-md p-6 flex flex-col items-center">
        
        {/* Logo and Title */}
        <div className="flex items-center gap-4 mb-10">
          <div className="h-14 w-14 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/30">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Yield <span className="text-violet-500">Voyager</span>
          </h1>
        </div>

        {/* Glassmorphism Login Card */}
        <div className="w-full bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl rounded-[32px] p-10 flex flex-col items-center text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Welcome Back</h2>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">
            Connect your Web3 wallet to securely access your AI-driven yield dashboard.
          </p>

          {/* Dynamic Rendering: Show Install Link or Login Button */}
          {walletMissing ? (
            <div className="w-full p-4 bg-orange-500/10 border border-orange-500/30 rounded-2xl flex flex-col items-center">
              <p className="text-orange-400 font-medium mb-3">MetaMask is not detected.</p>
              <a 
                href="https://metamask.io/download/" 
                target="_blank" 
                rel="noreferrer"
                className="text-white bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-xl font-bold transition-all shadow-lg"
              >
                Install MetaMask
              </a>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center">
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="w-full relative group overflow-hidden bg-white/5 hover:bg-white/10 border border-violet-500/50 hover:border-violet-400 rounded-2xl px-6 py-4 flex items-center justify-center gap-4 transition-all duration-300 shadow-[0_0_20px_rgba(139,92,246,0.15)] hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-violet-500/50"
              >
                {/* FEATURE 3: Animated Loading State */}
                {isConnecting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-violet-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-violet-300 font-bold text-lg tracking-wide">Connecting...</span>
                  </>
                ) : (
                  <>
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shadow-sm flex-shrink-0"></div>
                    <span className="text-white font-bold text-lg tracking-wide group-hover:text-violet-300 transition-colors">
                      Connect MetaMask
                    </span>
                  </>
                )}
              </button>
              
              {/* Error Message Display */}
              {errorMessage && (
                <p className="text-red-400 text-sm mt-4 text-center bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">
                  {errorMessage}
                </p>
              )}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <p className="text-gray-500 text-xs mt-8 font-mono tracking-widest uppercase">
          YieldVoyager System v1.0
        </p>
      </div>
    </div>
  );
}

export default Login;
