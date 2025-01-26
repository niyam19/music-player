import React, { useState } from "react";
import SongList from "./components/SongList";
import Player from "./components/Player";
import Song from "./types/Song";
import Header from "./components/Header";
import LeftPanel from "./components/LeftPanel";

const App: React.FC = () => {
  const songs: Song[] = [
    {
      songId: 1,
      songUrl:
        "https://aac.saavncdn.com/443/ecaf68741269f26720f881fa7dfd9121_160.mp4",
      songName: "Bhool Bhulaiya Title Track",
      songImage:
        "https://c.saavncdn.com/373/Stree-2-Hindi-2024-20240828083834-500x500.jpg",
    },
    {
      songId: 2,
      songUrl:
        "https://aac.saavncdn.com/408/7bef32663588ddf144175db97dc1749f_160.mp4",
      songName: "Chitta",
      songImage:
        "https://c.saavncdn.com/373/Stree-2-Hindi-2024-20240828083834-500x500.jpg",
    },
    {
      songId: 3,
      songUrl:
        "https://aac.saavncdn.com/373/6fceb8fe15f321872661c0835b6303b3_160.mp4",
      songName: "Khoobsurat",
      songImage:
        "https://c.saavncdn.com/373/Stree-2-Hindi-2024-20240828083834-500x500.jpg",
    },
  ];

  const [currentlyPlayingSongId, setCurrentlyPlayingSongId] = useState<
    number | null
  >(null);

  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const handleSongSelect = (song: Song) => {
    const index = songs.findIndex((s: Song) => s.songId == song.songId);
    if (index !== -1) {
      setCurrentSongIndex(index);
      setCurrentlyPlayingSongId((prev) =>
        prev === song.songId ? null : song.songId
      );
    }
  };

  const handlePrev = () => {
    setCurrentSongIndex((prev) => {
      const newIndex = prev > 0 ? prev - 1 : songs.length - 1;
      setCurrentlyPlayingSongId(songs[newIndex].songId);
      return newIndex;
    });
  };

  const handleNext = () => {
    setCurrentSongIndex((prev) => {
      const newIndex = prev < songs.length - 1 ? prev + 1 : 0;
      setCurrentlyPlayingSongId(songs[newIndex].songId);
      return newIndex;
    });
  };

  return (
    <div className="bg-gray-800 h-screen flex flex-col">
      <Header />
      <div className="flex">
        <LeftPanel />
        <SongList
          songs={songs}
          currentlyPlayingSongId={currentlyPlayingSongId}
          onSelect={handleSongSelect}
        />
      </div>
      <Player
        currentSong={songs[currentSongIndex].songUrl}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </div>
  );
};

export default App;
