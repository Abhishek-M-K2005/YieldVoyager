import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function Profile() {
  const { wallet, balance, network } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <button onClick={() => navigate('/dashboard')} className="text-violet-400 hover:text-violet-300 mb-8 flex items-center gap-2 transition-all">
          ← Back to Dashboard
        </button>

        <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-lg">
          <div className="flex items-center gap-6 mb-10">
            <div className="h-20 w-20 bg-gradient-to-tr from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center text-3xl font-bold">
              {wallet.substring(2, 4).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold">Investor Profile</h2>
              <p className="text-gray-400 font-mono text-sm">{wallet.substring(0, 6)}...{wallet.substring(wallet.length - 4)}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/5 p-4 rounded-2xl">
              <div className="flex justify-between mb-2 text-sm">
                <span className="text-gray-400">Profile Completion</span>
                <span className="text-violet-400">85%</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-violet-500 w-[85%]"></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border border-white/5">
                <p className="text-xs text-gray-500 uppercase">Primary Asset</p>
                <p className="text-lg font-mono">Ethereum (ETH)</p>
              </div>
              <div className="p-4 rounded-2xl border border-white/5">
                <p className="text-xs text-gray-500 uppercase">Connected Since</p>
                <p className="text-lg font-mono">Feb 2026</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
