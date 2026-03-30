import { NavLink, useNavigate } from "react-router-dom";

const navItems = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Markets", to: "/market" },
  { label: "Portfolio", to: "/profile" },
  { label: "Risk", to: "/predict" },
  { label: "Docs", to: "/docs" },
];

function navClassName(isActive) {
  return [
    "font-label text-[11px] uppercase tracking-[0.2em] transition-colors",
    isActive ? "text-primary" : "text-zinc-400 hover:text-primary",
  ].join(" ");
}

export default function AppNavbar({ showBack = false, onLogout }) {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 z-50 flex w-full items-center justify-between border-b border-outline-variant/20 bg-[#131313]/95 px-6 py-4 shadow-[0_4px_20px_rgba(0,0,0,0.5)] backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-2xl text-orange-500">bolt</span>
        <button
          className="text-2xl font-black tracking-tighter text-orange-500 drop-shadow-[0_0_10px_rgba(255,140,0,0.5)]"
          onClick={() => navigate("/dashboard")}
        >
          YieldVoyager
        </button>
      </div>

      <nav className="hidden items-center gap-6 md:flex">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => navClassName(isActive)}>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        {showBack ? (
          <button
            onClick={() => navigate(-1)}
            className="rounded-lg border border-outline-variant/20 px-3 py-2 text-xs uppercase tracking-wider text-zinc-300 hover:bg-surface-container-high"
          >
            Back
          </button>
        ) : null}
        {onLogout ? (
          <button
            onClick={onLogout}
            className="rounded-lg border border-outline-variant/20 px-3 py-2 text-xs uppercase tracking-wider text-zinc-300 hover:bg-surface-container-high"
          >
            Logout
          </button>
        ) : null}
      </div>
    </header>
  );
}