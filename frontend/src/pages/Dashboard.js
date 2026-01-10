import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Dashboard() {
  const { logout } = useContext(AuthContext);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Wallet authenticated</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Dashboard;
