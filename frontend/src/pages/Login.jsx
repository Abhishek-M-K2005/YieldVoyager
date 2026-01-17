import { ethers } from "ethers";
import { getNonce, verifySignature } from "../api/auth";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

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

  return (
    <div className="flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 h-screen w-full justify-center items-center">
      {/* Heading */}
      <h1 className="text-white text-5xl font-extrabold font-mono mb-12 tracking-wide drop-shadow-lg">
        YieldVoyager
      </h1>

      {/* Glass login card */}
      <div className="flex flex-col justify-center items-center border-2 border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl hover:shadow-violet-500/50 transition-all duration-300 h-[380px] w-[520px] rounded-[24px] p-6">
        <h2 className="text-white text-2xl font-mono mb-6 text-center tracking-wide">
          Login & Connect
        </h2>

        <button
          className="bg-violet-500 hover:bg-violet-600 active:bg-violet-700 focus:outline-2 focus:outline-offset-2 focus:outline-violet-400 rounded-full px-6 py-3 border-2 border-violet-600 text-white font-semibold text-lg shadow-md hover:shadow-violet-500/50 transition-all duration-200"
          onClick={connectWallet}
        >
          Login with MetaMask
        </button>
      </div>
    </div>
  );
}

export default Login;
