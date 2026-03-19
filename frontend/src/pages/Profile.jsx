import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { getProfile, updateProfile } from "../api/auth";

export default function Profile() {
  const { wallet, balance, network, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    risk_tolerance: "medium",
    investment_goal: "Long-term Growth"
  });

  useEffect(() => {
    if (token) {
      getProfile(token)
        .then(data => {
          setProfile(prev => ({ ...prev, ...data }));
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [token]);

  const handleSave = async () => {
    try {
      await updateProfile(token, profile);
      setEditing(false);
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

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
              <h2 className="text-2xl font-bold">{profile.username || "Investor Profile"}</h2>
              <p className="text-gray-400 font-mono text-sm">{wallet.substring(0, 6)}...{wallet.substring(wallet.length - 4)}</p>
            </div>
            <button 
              onClick={() => editing ? handleSave() : setEditing(true)}
              className="ml-auto px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg text-sm font-medium transition-colors"
            >
              {editing ? "Save Changes" : "Edit Profile"}
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-white/5 p-6 rounded-2xl space-y-4">
              <h3 className="text-lg font-semibold text-gray-200">Personal Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs text-gray-500 uppercase block mb-1">Username</label>
                  {editing ? (
                    <input 
                      type="text" 
                      value={profile.username || ""} 
                      onChange={e => setProfile({...profile, username: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-violet-500"
                    />
                  ) : (
                    <p className="text-lg font-mono">{profile.username || "Not set"}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs text-gray-500 uppercase block mb-1">Email</label>
                  {editing ? (
                    <input 
                      type="email" 
                      value={profile.email || ""} 
                      onChange={e => setProfile({...profile, email: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-violet-500"
                    />
                  ) : (
                    <p className="text-lg font-mono">{profile.email || "Not set"}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs text-gray-500 uppercase block mb-1">Risk Tolerance</label>
                  {editing ? (
                    <select 
                      value={profile.risk_tolerance} 
                      onChange={e => setProfile({...profile, risk_tolerance: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-violet-500"
                    >
                      <option value="low" className="bg-gray-800">Conservative</option>
                      <option value="medium" className="bg-gray-800">Moderate</option>
                      <option value="high" className="bg-gray-800">Aggressive</option>
                    </select>
                  ) : (
                    <p className="text-lg font-mono capitalize">{profile.risk_tolerance}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs text-gray-500 uppercase block mb-1">Investment Goal</label>
                  {editing ? (
                    <input 
                      type="text" 
                      value={profile.investment_goal || ""} 
                      onChange={e => setProfile({...profile, investment_goal: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-violet-500"
                    />
                  ) : (
                    <p className="text-lg font-mono">{profile.investment_goal || "Not set"}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border border-white/5">
                <p className="text-xs text-gray-500 uppercase">Current Balance</p>
                <p className="text-lg font-mono">{balance ? `${balance} ETH` : '0.0000 ETH'}</p>
              </div>
              <div className="p-4 rounded-2xl border border-white/5">
                <p className="text-xs text-gray-500 uppercase">Network</p>
                <p className="text-lg font-mono capitalize">{network || 'Unknown'}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
