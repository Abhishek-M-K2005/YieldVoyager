import { ethers } from "ethers";
import { getNonce, verifySignature } from "../api/auth";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

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

      login(tokens.access);
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
    <div>
      <Header/>
    <div className="flex bg-gray-800 h-screen w-full justify-center items-center">
      <div className="flex flex-col justify-center items-center border-2 border-white/30 bg-white/10 backdrop-blur-sm shadow-2xl h-[350px] w-[500px] rounded-[20px] ">
        <h1 className="text-white text-lg font-mono my-5">Login & Connect</h1>
        
        <button class="bg-violet-500 hover:bg-violet-600 focus:outline-2 focus:outline-offset-2 focus:outline-violet-500 active:bg-violet-700 rounded-full p-2 border-2 border-violet-600 my-5" onClick={connectWallet}>
          <span className="text-white font-stretch-100% subpixel-antialiased hover:drop-shadow-blue-500  ">Login with Metamask</span>
        </button>
      </div>
    </div>
    </div>
    );
}

export default Login;
