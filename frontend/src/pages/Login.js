import { ethers } from "ethers";
import { getNonce, verifySignature } from "../api/auth";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const { login } = useContext(AuthContext);

  const connectWallet = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    const { nonce } = await getNonce(address);
    const signature = await signer.signMessage(nonce);
    const tokens = await verifySignature(address, signature);

    login(tokens.access);
  };

  return <button onClick={connectWallet}>Login with MetaMask</button>;
}

export default Login;
