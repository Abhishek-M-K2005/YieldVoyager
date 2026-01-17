import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Header from "../components/Header";

export default function Dashboard() {
  const { logout } = useContext(AuthContext);

  return (
    <>
      <Header />

      {/* Main content */}
      <div className="flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 h-screen w-full justify-center items-center px-4">
        {/* Glass card */}
        <div className="flex flex-col justify-center items-center border-2 border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl hover:shadow-violet-500/50 transition-all duration-300 h-[350px] w-[500px] rounded-[24px] p-6">
          <h1 className="text-white text-3xl font-mono my-5 text-center tracking-wide drop-shadow-md">
            Welcome to YieldVoyager!
          </h1>
          <p className="text-gray-300 text-center px-6 text-lg">
            You are now connected. Explore your dashboard and DeFi risk predictions.
          </p>
        </div>

        {/* Logout button at bottom */}
        <button
          className="mt-10 bg-violet-500 hover:bg-violet-600 active:bg-violet-700 text-white px-8 py-3 rounded-md border-2 border-violet-600 shadow-md hover:shadow-violet-500/50 transition-all duration-200 font-semibold text-lg"
          onClick={() => {
            logout();
            window.location.href = "/";
          }}
        >
          Logout
        </button>
      </div>
    </>
  );
}
