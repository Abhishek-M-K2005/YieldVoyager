import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile"; 

// 1. Import your 3 new pages
import MarketToday from "./pages/MarketToday";
import RiskPrediction from "./pages/RiskPrediction";
import ProceduralDoc from "./pages/ProceduralDoc";

import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* PUBLIC ROUTE */}
          <Route path="/" element={<Login />} />
          
          {/* PROTECTED ROUTES (Requires Web3 Auth) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* The New Navbar Routes */}
          <Route
            path="/market"
            element={
              <ProtectedRoute>
                <MarketToday />
              </ProtectedRoute>
            }
          />

          <Route
            path="/predict"
            element={
              <ProtectedRoute>
                <RiskPrediction />
              </ProtectedRoute>
            }
          />

          <Route
            path="/docs"
            element={
              <ProtectedRoute>
                <ProceduralDoc />
              </ProtectedRoute>
            }
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
