import React from "react";
import Player from "./components/Player";
import Header from "./components/Header";
import LeftPanel from "./components/LeftPanel";
import AppRoutes from "./routes/routes";
import { BrowserRouter as Router } from "react-router-dom";
import { AudioProvider } from "./contexts/AudioContext";
import { LikedSongsProvider } from "./contexts/LikedSongsContext";

// To do :
// - when selected song from the liked songs song should play from liked songs list already done need improvements

const App: React.FC = () => {
  return (
    <LikedSongsProvider>
      <AudioProvider>
        <Router>
          <div className="bg-gray-800 h-screen flex flex-col">
            <Header />
            <div className="flex">
              <LeftPanel />
              {/* <Home/> */}
              <div className="flex-1">
                <AppRoutes />
              </div>
            </div>
            <Player />
          </div>
        </Router>
      </AudioProvider>
    </LikedSongsProvider>
  );
};

export default App;
