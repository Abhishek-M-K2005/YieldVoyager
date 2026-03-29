import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import AppNavbar from "../components/AppNavbar";
import "../styles/Profile.css";

const themeColors = {
  violet: { bg: 'bg-violet-500', text: 'text-violet-400', from: 'from-violet-500', border: 'border-violet-500', hoverText: 'hover:text-violet-300', fill: 'bg-violet-500' },
  emerald: { bg: 'bg-emerald-500', text: 'text-emerald-400', from: 'from-emerald-500', border: 'border-emerald-500', hoverText: 'hover:text-emerald-300', fill: 'bg-emerald-500' },
  amber: { bg: 'bg-amber-500', text: 'text-amber-400', from: 'from-amber-500', border: 'border-amber-500', hoverText: 'hover:text-amber-300', fill: 'bg-amber-500' },
  rose: { bg: 'bg-rose-500', text: 'text-rose-400', from: 'from-rose-500', border: 'border-rose-500', hoverText: 'hover:text-rose-300', fill: 'bg-rose-500' },
};

const MOCK_RATES = { ETH: 1, USD: 3100.50, EUR: 2850.25 };

export default function Profile() {
  const { wallet, balance, network } = useContext(AuthContext);

  const [theme, setTheme] = useState(() => localStorage.getItem('yv_theme') || 'violet');
  const [privacyMode, setPrivacyMode] = useState(() => JSON.parse(localStorage.getItem('yv_privacy')) || false);
  const [currency, setCurrency] = useState(() => localStorage.getItem('yv_currency') || 'ETH');
  
  const [addressBook, setAddressBook] = useState(() => JSON.parse(localStorage.getItem('yv_addresses')) || []);
  const [newAddrName, setNewAddrName] = useState('');
  const [newAddrValue, setNewAddrValue] = useState('');

  useEffect(() => { localStorage.setItem('yv_theme', theme); }, [theme]);
  useEffect(() => { localStorage.setItem('yv_privacy', JSON.stringify(privacyMode)); }, [privacyMode]);
  useEffect(() => { localStorage.setItem('yv_currency', currency); }, [currency]);
  useEffect(() => { localStorage.setItem('yv_addresses', JSON.stringify(addressBook)); }, [addressBook]);

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

  const holdings = [
    { name: "Ethereum", symbol: "ETH", pct: 42, value: "$12,840" },
    { name: "Solana", symbol: "SOL", pct: 21, value: "$6,420" },
    { name: "Stable Vault", symbol: "USDC", pct: 25, value: "$7,100" },
    { name: "Risk Basket", symbol: "ALTS", pct: 12, value: "$3,390" },
  ];

  const shortWallet = wallet ? `${wallet.substring(0, 6)}...${wallet.substring(wallet.length - 4)}` : "Not Connected";

  return (
    <div className="profile-page">
      <AppNavbar />

      <main className="profile-main-shell">
        <section className="profile-hero glass-panel">
          <div>
            <p className="profile-hero-kicker">Net Terminal Balance</p>
            <div className="profile-hero-value-wrap">
              <h2 className={privacyMode ? "profile-hero-value masked" : "profile-hero-value"}>{getDisplayBalance()}</h2>
              <span className={`profile-hero-chip ${currentTheme.text}`}>+12.4%</span>
            </div>
            <p className="profile-hero-sub">{shortWallet} • {network || "mainnet"}</p>
          </div>
          <div className="profile-hero-actions">
            <button className={currentTheme.bg}>Deposit</button>
            <button>Withdraw</button>
          </div>
        </section>

        <section className="profile-grid">
          <article className="profile-panel profile-panel-wide glass-panel">
            <div className="profile-panel-head">
              <div>
                <h3>Diversification</h3>
                <p>Asset Distribution Matrix</p>
              </div>
              <span className="material-symbols-outlined">data_exploration</span>
            </div>

            <div className="profile-diversification-body">
              <div className="profile-donut-wrap solar-glow">
                <svg className="profile-donut" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#2a2a2a" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#ff8c00" strokeDasharray="45 55" strokeDashoffset="0" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#ffbf00" strokeDasharray="25 75" strokeDashoffset="-45" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#ffb77d" strokeDasharray="30 70" strokeDashoffset="-70" strokeWidth="3" />
                </svg>
                <div className="profile-donut-center">
                  <span>Main Index</span>
                  <strong>64%</strong>
                </div>
              </div>

              <div className="profile-holding-list">
                {holdings.map((item) => (
                  <div key={item.symbol} className="profile-holding-row">
                    <div>
                      <p>{item.name}</p>
                      <small>{item.symbol}</small>
                    </div>
                    <strong>{item.value}</strong>
                    <div className="profile-holding-progress"><div className={currentTheme.fill} style={{ width: `${item.pct}%` }} /></div>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <aside className="profile-panel glass-panel">
            <h3>Control Deck</h3>

            <div className="profile-setting-row">
              <div>
                <p>Privacy Mode</p>
                <small>Mask live values</small>
              </div>
              <button onClick={() => setPrivacyMode(!privacyMode)} className={privacyMode ? `profile-toggle ${currentTheme.bg}` : "profile-toggle"}>
                <span className={privacyMode ? "on" : "off"} />
              </button>
            </div>

            <div className="profile-setting-block">
              <p>Display Currency</p>
              <div className="profile-currency-grid">
                {["ETH", "USD", "EUR"].map((curr) => (
                  <button key={curr} onClick={() => setCurrency(curr)} className={currency === curr ? `${currentTheme.bg} active` : ""}>
                    {curr}
                  </button>
                ))}
              </div>
            </div>

            <div className="profile-setting-block">
              <p>Theme Signal</p>
              <div className="profile-theme-dots">
                {[
                  { id: "violet", hex: "bg-violet-500" },
                  { id: "emerald", hex: "bg-emerald-500" },
                  { id: "amber", hex: "bg-amber-500" },
                  { id: "rose", hex: "bg-rose-500" },
                ].map((color) => (
                  <button key={color.id} onClick={() => setTheme(color.id)} className={`${color.hex} ${theme === color.id ? "active" : ""}`} />
                ))}
              </div>
            </div>
          </aside>
        </section>

        <section className="profile-grid">
          <article className="profile-panel profile-panel-wide glass-panel">
            <h3>Address Book</h3>
            <p className="profile-muted">Store frequently used wallet destinations in local browser storage.</p>

            <div className="profile-address-form">
              <input type="text" placeholder="Name" value={newAddrName} onChange={(e) => setNewAddrName(e.target.value)} />
              <input type="text" placeholder="0x..." value={newAddrValue} onChange={(e) => setNewAddrValue(e.target.value)} />
              <button onClick={handleAddAddress} className={currentTheme.bg}>Add</button>
            </div>

            <div className="profile-address-list custom-scrollbar">
              {addressBook.length === 0 ? (
                <p className="profile-empty">No addresses saved.</p>
              ) : (
                addressBook.map((item) => (
                  <div key={item.id} className="profile-address-row">
                    <div>
                      <p>{item.name}</p>
                      <small>{item.address.substring(0, 12)}...{item.address.substring(item.address.length - 4)}</small>
                    </div>
                    <button onClick={() => removeAddress(item.id)}>✕</button>
                  </div>
                ))
              )}
            </div>
          </article>

          <aside className="profile-panel glass-panel">
            <h3>Activity Feed</h3>
            <div className="profile-activity-list">
              <div><p>Vault deposit queued</p><small>2 MIN AGO</small></div>
              <div><p>Privacy mode toggled</p><small>10 MIN AGO</small></div>
              <div><p>Address added to book</p><small>1 HOUR AGO</small></div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}