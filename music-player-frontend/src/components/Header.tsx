import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../assets/icons/music-player.png";
import Profile from "../assets/icons/profile-icon.png";
import { useAudioContext } from "../contexts/AudioContext";
import { FaPlay } from "react-icons/fa";
import { GiSoundWaves } from "react-icons/gi";

const Header = () => {
  const userData = localStorage.getItem("userData");
  const user = userData ? JSON.parse(userData) : null;
  const navigate = useNavigate();
  const { songs, currentSong, handleSongSelect } = useAudioContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSongs, setFilteredSongs] = useState<typeof songs>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredSongs([]);
    } else {
      const filtered = songs.filter((song) =>
        song.songName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSongs(filtered);
    }
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setFilteredSongs([]);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full bg-black text-white flex items-center justify-between px-6 py-4 shadow-md relative">
      {/* Left - Logo & Title */}
      <div className="flex items-center">
        <img
          src={Icon}
          alt="Music Player Logo"
          className="w-8 h-8 cursor-pointer"
          onClick={() => navigate("/")}
        />
        <h1 className="ml-2 text-xl font-bold">Music Player</h1>
      </div>

      {/* Center - Search Input */}
      <div ref={searchRef} className="relative w-full max-w-lg min-w-48 mx-4">
        <input
          type="text"
          placeholder="Search"
          className="w-full bg-zinc-900 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {/* Search Results Dropdown */}
        {filteredSongs.length > 0 && (
          <div
            className="absolute w-full bg-zinc-900 border border-gray-700 mt-1 rounded-lg max-h-60 overflow-y-auto z-50 shadow-lg"
            style={{ top: "100%", left: 0 }} // Ensure dropdown appears below input
          >
            {filteredSongs.map((song, index) => {
              const isPlayingSong = currentSong?.songId === song.songId;

              return (
                <div
                  key={index}
                  className={`group flex items-center p-2 hover:bg-zinc-800 transition duration-300 cursor-pointer ${
                    isPlayingSong ? "text-blue-500" : "text-white"
                  }`}
                  onClick={() => {
                    handleSongSelect(song, false);
                    setSearchQuery(""); // Clear search on selection
                  }}
                >
                  <div className="relative w-10 h-10 mr-2">
                    <img
                      className="w-full h-full rounded-sm"
                      src={song.songImage}
                      alt={song.songName}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {isPlayingSong ? (
                        <GiSoundWaves size={40}/>
                      ) : (
                        <FaPlay size={20} color="white" />
                      )}
                    </div>
                  </div>
                  <span className="group-hover:text-gray-300 transition-colors duration-300">
                    {song.songName}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Right - Profile */}
      <div className="flex items-center">
        <img
          title={user?.username}
          onClick={() => navigate("/profile")}
          src={Profile}
          alt="Profile Logo"
          className="w-8 h-8 rounded-full cursor-pointer hover:scale-110 transition-transform duration-300"
        />
      </div>
    </header>
  );
};

export default Header;
