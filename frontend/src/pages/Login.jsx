import { ethers } from "ethers";
import { getNonce, verifySignature } from "../api/auth";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // THE ENGINE: We are not touching a single line of this logic. 
  // It stays perfectly intact so your routing doesn't break.
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      const { nonce } = await getNonce(address);
      const signature = await signer.signMessage(nonce);
      const tokens = await verifySignature(address, signature);

      login(tokens.access, address);
      navigate("/dashboard");
    } catch (error) {
      if (error.code === 4001 || error.code === 'ACTION_REJECTED') {
        alert("You rejected the signature request in your wallet. Please try again and click 'Sign'.");
      } else {
        console.error("Login failed:", error);
        alert("Login failed. Check console for details.");
      }
    }
  };

  // THE PAINT JOB: Completely redesigned UI
  return (
    <div className="relative min-h-screen bg-[#0f172a] flex flex-col justify-center items-center overflow-hidden font-sans">
      
      {/* Ambient Background Glows (Matches the crypto aesthetic) */}
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
          <p className="text-gray-400 text-sm mb-10 leading-relaxed">
            Connect your Web3 wallet to securely access your AI-driven yield dashboard.
          </p>

          <button
            onClick={connectWallet}
            className="w-full relative group overflow-hidden bg-white/5 hover:bg-white/10 border border-violet-500/50 hover:border-violet-400 rounded-2xl px-6 py-4 flex items-center justify-center gap-4 transition-all duration-300 shadow-[0_0_20px_rgba(139,92,246,0.15)] hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]"
          >
            {/* Simple Orange indicator for MetaMask */}
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shadow-sm flex-shrink-0"></div>
            <span className="text-white font-bold text-lg tracking-wide group-hover:text-violet-300 transition-colors">
              Connect MetaMask
            </span>
          </button>
        </div>

      </div>
    </div>
  );
}

export default Login;
