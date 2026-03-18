import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

// 1. Tailwind Safe Color Map (Prevents CSS purge bugs)
const themeColors = {
  violet: { bg: 'bg-violet-500', text: 'text-violet-400', from: 'from-violet-500', border: 'border-violet-500', hoverText: 'hover:text-violet-300', fill: 'bg-violet-500' },
  emerald: { bg: 'bg-emerald-500', text: 'text-emerald-400', from: 'from-emerald-500', border: 'border-emerald-500', hoverText: 'hover:text-emerald-300', fill: 'bg-emerald-500' },
  amber: { bg: 'bg-amber-500', text: 'text-amber-400', from: 'from-amber-500', border: 'border-amber-500', hoverText: 'hover:text-amber-300', fill: 'bg-amber-500' },
  rose: { bg: 'bg-rose-500', text: 'text-rose-400', from: 'from-rose-500', border: 'border-rose-500', hoverText: 'hover:text-rose-300', fill: 'bg-rose-500' },
};

// Mock exchange rates for the currency selector
const MOCK_RATES = { ETH: 1, USD: 3100.50, EUR: 2850.25 };

export default function Profile() {
  const { wallet, balance, network } = useContext(AuthContext);
  const navigate = useNavigate();

  // --- LOCAL STORAGE STATES ---
  const [theme, setTheme] = useState(() => localStorage.getItem('yv_theme') || 'violet');
  const [privacyMode, setPrivacyMode] = useState(() => JSON.parse(localStorage.getItem('yv_privacy')) || false);
  const [currency, setCurrency] = useState(() => localStorage.getItem('yv_currency') || 'ETH');
  
  // Address Book State
  const [addressBook, setAddressBook] = useState(() => JSON.parse(localStorage.getItem('yv_addresses')) || []);
  const [newAddrName, setNewAddrName] = useState('');
  const [newAddrValue, setNewAddrValue] = useState('');

  // --- AUTO-SAVE EFFECTS ---
  useEffect(() => { localStorage.setItem('yv_theme', theme); }, [theme]);
  useEffect(() => { localStorage.setItem('yv_privacy', JSON.stringify(privacyMode)); }, [privacyMode]);
  useEffect(() => { localStorage.setItem('yv_currency', currency); }, [currency]);
  useEffect(() => { localStorage.setItem('yv_addresses', JSON.stringify(addressBook)); }, [addressBook]);

  // --- HELPER FUNCTIONS ---
  const currentTheme = themeColors[theme];

  const getDisplayBalance = () => {
    if (privacyMode) return '****';
    const numBalance = parseFloat(balance || 0);
    const converted = (numBalance * MOCK_RATES[currency]).toFixed(currency === 'ETH' ? 4 : 2);
    return `${currency === 'USD' ? '$' : currency === 'EUR' ? '€' : ''}${converted} ${currency === 'ETH' ? 'ETH' : ''}`;
  };

  const handleAddAddress = () => {
    if (!newAddrName || !newAddrValue) return;
    setAddressBook([...addressBook, { id: Date.now(), name: newAddrName, address: newAddrValue }]);
    setNewAddrName('');
    setNewAddrValue('');
  };

  const removeAddress = (id) => {
    setAddressBook(addressBook.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white pb-20">
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-12">
        
        {/* Navigation */}
        <button onClick={() => navigate('/dashboard')} className={`${currentTheme.text} ${currentTheme.hoverText} mb-8 flex items-center gap-2 transition-all font-medium`}>
          ← Back to Dashboard
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN: Main Profile & Stats */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Identity Card */}
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-lg">
              <div className="flex items-center gap-6 mb-8">
                <div className={`h-20 w-20 bg-gradient-to-tr ${currentTheme.from} to-gray-800 rounded-full flex items-center justify-center text-3xl font-bold shadow-lg`}>
                  {wallet ? wallet.substring(2, 4).toUpperCase() : 'NA'}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Investor Profile</h2>
                  <p className="text-gray-400 font-mono text-sm">{wallet ? `${wallet.substring(0, 6)}...${wallet.substring(wallet.length - 4)}` : 'Not Connected'}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="bg-white/5 p-4 rounded-2xl mb-6">
                <div className="flex justify-between mb-2 text-sm">
                  <span className="text-gray-400">Profile Completion</span>
                  <span className={currentTheme.text}>85%</span>
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className={`h-full ${currentTheme.fill} w-[85%] transition-all duration-500`}></div>
                </div>
              </div>

              {/* Display Balance (Affected by Currency & Privacy) */}
              <div className="p-6 rounded-2xl border border-white/5 bg-black/20 mb-6">
                <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Total Wallet Value</p>
                <p className={`text-3xl font-mono ${privacyMode ? 'text-gray-500 mt-2' : 'text-white'}`}>
                  {getDisplayBalance()}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-white/5 bg-white/5">
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Primary Asset</p>
                  <p className="text-lg font-mono">Ethereum</p>
                </div>
                <div className="p-4 rounded-2xl border border-white/5 bg-white/5">
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Network</p>
                  <p className="text-lg font-mono capitalize">{network || 'Mainnet'}</p>
                </div>
              </div>
            </div>

            {/* Address Book Card */}
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-lg">
              <h3 className="text-xl font-bold mb-6">Local Address Book</h3>
              <p className="text-gray-400 text-sm mb-6">Save frequently used addresses directly to your browser.</p>
              
              <div className="flex gap-3 mb-6">
                <input 
                  type="text" 
                  placeholder="Name (e.g., Vault)" 
                  value={newAddrName}
                  onChange={(e) => setNewAddrName(e.target.value)}
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-500"
                />
                <input 
                  type="text" 
                  placeholder="0x..." 
                  value={newAddrValue}
                  onChange={(e) => setNewAddrValue(e.target.value)}
                  className="flex-[2] bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-gray-500"
                />
                <button 
                  onClick={handleAddAddress}
                  className={`${currentTheme.bg} hover:opacity-80 px-6 py-3 rounded-xl font-bold transition-all`}
                >
                  Add
                </button>
              </div>

              <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                {addressBook.length === 0 ? (
                  <p className="text-center text-gray-500 py-4 font-mono text-sm">No addresses saved.</p>
                ) : (
                  addressBook.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-4 rounded-xl border border-white/5 bg-black/20 hover:bg-white/5 transition-all">
                      <div>
                        <p className="font-bold text-sm">{item.name}</p>
                        <p className="text-gray-500 font-mono text-xs mt-1">{item.address.substring(0, 12)}...{item.address.substring(item.address.length - 4)}</p>
                      </div>
                      <button onClick={() => removeAddress(item.id)} className="text-gray-600 hover:text-red-400 p-2">
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Settings & Preferences */}
          <div className="space-y-6">
            
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-lg">
              <h3 className="text-xl font-bold mb-8">App Settings</h3>
              
              {/* Privacy Toggle */}
              <div className="flex justify-between items-center mb-8">
                <div>
                  <p className="font-bold">Privacy Mode</p>
                  <p className="text-gray-400 text-xs mt-1">Hide balances on screen</p>
                </div>
                <button 
                  onClick={() => setPrivacyMode(!privacyMode)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${privacyMode ? currentTheme.bg : 'bg-gray-700'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${privacyMode ? 'translate-x-7' : 'translate-x-1'}`}></div>
                </button>
              </div>

              {/* Base Currency */}
              <div className="mb-8">
                <p className="font-bold mb-3">Base Currency</p>
                <div className="flex gap-2 p-1 bg-black/40 rounded-xl">
                  {['ETH', 'USD', 'EUR'].map((curr) => (
                    <button 
                      key={curr}
                      onClick={() => setCurrency(curr)}
                      className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${currency === curr ? `${currentTheme.bg} text-white shadow-lg` : 'text-gray-500 hover:text-white'}`}
                    >
                      {curr}
                    </button>
                  ))}
                </div>
              </div>

              {/* UI Accent Color */}
              <div>
                <p className="font-bold mb-4">UI Accent Color</p>
                <div className="flex gap-4">
                  {[
                    { id: 'violet', hex: 'bg-violet-500' },
                    { id: 'emerald', hex: 'bg-emerald-500' },
                    { id: 'amber', hex: 'bg-amber-500' },
                    { id: 'rose', hex: 'bg-rose-500' }
                  ].map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setTheme(color.id)}
                      className={`w-8 h-8 rounded-full ${color.hex} transition-all ${theme === color.id ? 'ring-2 ring-white ring-offset-2 ring-offset-[#0f172a] scale-110' : 'opacity-50 hover:opacity-100'}`}
                    />
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
