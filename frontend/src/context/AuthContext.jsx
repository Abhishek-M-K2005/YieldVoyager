import { createContext, useState, useEffect, useContext } from "react";
import { ethers } from "ethers";

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [wallet, setWallet] = useState(localStorage.getItem("wallet") || "");
  const [balance, setBalance] = useState(0);
  const [network, setNetwork] = useState("");

  const login = async (access, walletAddress) => {
    localStorage.setItem("token", access);
    localStorage.setItem("wallet", walletAddress);
    setToken(access);
    setWallet(walletAddress);

    await fetchBalanceAndNetwork(walletAddress);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("wallet");
    setToken(null);
    setWallet("");
    setBalance(0);
    setNetwork("");
  };

  // Fetch balance and network function
  const fetchBalanceAndNetwork = async (walletAddress) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      
      // Auto-switch to Sepolia Testnet if on Mainnet
      if (network.chainId === 1n) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0xaa36a7" }], // Sepolia Chain ID
          });
          // Allow time for switch before fetching again
          setTimeout(() => fetchBalanceAndNetwork(walletAddress), 1000);
          return;
        } catch (error) {
          console.error("User rejected network switch or error:", error);
        }
      }

      const bal = await provider.getBalance(walletAddress);
      setBalance(Number(ethers.formatEther(bal)).toFixed(4));
      setNetwork(network.name === 'unknown' ? 'Sepolia (Testnet)' : network.name); // Ethers sometimes returns unknown for testnets
    } catch (err) {
      console.error("Failed to fetch balance/network:", err);
      setBalance(0);
      setNetwork("");
    }
  };

  // ✅ On mount, if wallet exists, fetch balance & network
  useEffect(() => {
    if (wallet) {
      fetchBalanceAndNetwork(wallet);

      // Optional: auto-refresh every 10 seconds
      const interval = setInterval(() => fetchBalanceAndNetwork(wallet), 10000);
      return () => clearInterval(interval);
    }
  }, [wallet]);

  return (
    <AuthContext.Provider value={{ token, login, logout, wallet, balance, network }}>
      {children}
    </AuthContext.Provider>
  );
}
