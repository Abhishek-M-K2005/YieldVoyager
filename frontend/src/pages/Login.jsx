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

  return <button onClick={connectWallet}>Login with MetaMask</button>;
}

export default Login;
