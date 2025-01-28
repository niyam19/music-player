import React from "react";
import SongList from "./components/SongList";
import Player from "./components/Player";
import Header from "./components/Header";
import LeftPanel from "./components/LeftPanel";
import { songs } from "./SongData";

const App: React.FC = () => {
  return (
    <div className="bg-gray-800 h-screen flex flex-col">
      <Header />
      <div className="flex">
        <LeftPanel />
        <SongList
          songs={songs}
        />
      </div>
      <Player/>
    </div>
  );
};

export default App;
