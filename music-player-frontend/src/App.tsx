import React, { useEffect, useState } from "react";
import Player from "./components/Player";
import Header from "./components/Header";
import LeftPanel from "./components/LeftPanel";
import AppRoutes from "./routes/appRoutes";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import { AudioProvider } from "./contexts/AudioContext";
import { LikedSongsProvider } from "./contexts/LikedSongsContext";
import { PlaylistProvider } from "./contexts/PlaylistContext";
import AuthRoutes from "./routes/authRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
      <PlaylistProvider>
        <AudioProvider>
          <div className="app-container bg-gradient-to-b from-zinc-900 to-black min-h-screen flex flex-col">
            <Header />
            <div className="flex flex-1 overflow-hidden">
              <LeftPanel />
              <div className="flex-1 overflow-hidden">
                <AppRoutes />
              </div>
            </div>
            <Player />
          </div>
        </AudioProvider>
      </PlaylistProvider>
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
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{
          background: "rgba(24, 24, 27, 0.9)",
          color: "#fff",
          fontSize: "14px",
          fontWeight: "500",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)"
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
