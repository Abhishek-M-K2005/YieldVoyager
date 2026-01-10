import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Header from "../components/Header";

function Dashboard() {
  const { logout } = useContext(AuthContext);

  return (
    <div className="bg-[#131314]">
      <Header/>
   
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-10">
  <div className="relative isolate">
    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/50 to-blue-500/40 blur-3xl opacity-70"></div>
    
    <div className="relative rounded-xl border border-white/10 bg-gray-800/60 p-10 flex flex-col items-center shadow-2xl backdrop-blur-sm">
      <h2 className="text-3xl font-semibold text-white mb-4">Dashboard</h2>
      <p className="text-gray-300 max-w-sm text-center">
        Welcome to Yield Voyager. Your Wallet has be verified.
      </p>
      <button className="mt-6 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300" onClick={logout}>Logout</button>
      
    </div>
  </div>
</div>
    </div>
  );
}

export default Dashboard;
