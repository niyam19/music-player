import React, { useEffect, useState } from "react";
import Player from "./components/Player";
import Header from "./components/Header";
import LeftPanel from "./components/LeftPanel";
import AppRoutes from "./routes/appRoutes";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import { AudioProvider } from "./contexts/AudioContext";
import { LikedSongsProvider } from "./contexts/LikedSongsContext";
import AuthRoutes from "./routes/authRoutes";
import { ToastContainer } from "react-toastify";

// Function to check authentication status
const getAuthStatus = () => {
  return localStorage.getItem("token") !== null;
};

const AppContent: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(getAuthStatus());
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = getAuthStatus();
      setIsAuthenticated(authStatus);
      if (!authStatus && window.location.pathname.toLowerCase() !== "/signup") {
        navigate("/login", { replace: true });
      }
      if (
        authStatus &&
        (window.location.pathname.toLowerCase() == "/login" ||
          window.location.pathname.toLowerCase() == "/signup")
      ) {
        navigate("/", { replace: true });
      }
    };

    checkAuth();
    window.addEventListener("storage", checkAuth); // Detects token changes

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, [navigate]);

  return isAuthenticated ? (
    <LikedSongsProvider>
      <AudioProvider>
        <div className="bg-gray-800 h-screen flex flex-col">
          <Header />
          <div className="flex">
            <LeftPanel />
            <div className="flex-1">
              <AppRoutes />
            </div>
          </div>
          <Player />
        </div>
      </AudioProvider>
    </LikedSongsProvider>
  ) : (
    <AuthRoutes />
  );
};

const App: React.FC = () => {
  return (
    <>
      <ToastContainer 
        position="bottom-left"
        autoClose={2000}
        hideProgressBar
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
        toastStyle={{
          backgroundColor: "#333",
          color: "#fff",
          fontSize: "16px",
          fontWeight: "bold",
          textAlign: "center",
          padding: "12px 20px",
        }}
        className="custom-toast-container"
      />
      <Router>
        <AppContent />
      </Router>
    </>
  );
};

export default App;
