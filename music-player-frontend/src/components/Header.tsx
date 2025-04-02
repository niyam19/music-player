import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../assets/icons/music-player.png";
import Profile from "../assets/icons/profile-icon.png";
import { useAudioContext } from "../contexts/AudioContext";
import { FaPlay } from "react-icons/fa";
import { GiSoundWaves } from "react-icons/gi";
import { FaSearch } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";

const Header = () => {
  const userData = localStorage.getItem("userData");
  const user = userData ? JSON.parse(userData) : null;
  const navigate = useNavigate();
  const { songs, currentSong, handleSongSelect } = useAudioContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSongs, setFilteredSongs] = useState<typeof songs>([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredSongs([]);
    } else {
      const filtered = songs.filter((song) =>
        song.songName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSongs(filtered);
    }
  }, [searchQuery, songs]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setFilteredSongs([]);
        setSearchQuery("");
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-black bg-opacity-50 border-b border-zinc-800 text-white flex items-center justify-between px-6 py-3 shadow-lg">
      {/* Left - Logo & Title */}
      <div className="flex items-center">
        <div className="flex items-center group cursor-pointer" onClick={() => navigate("/")}>
          <img
            src={Icon}
            alt="Music Player Logo"
            className="w-9 h-9 group-hover:scale-110 transition-transform duration-300"
          />
          <h1 className="ml-2 text-xl font-bold group-hover:text-blue-400 transition-colors duration-300">
            Harmony
          </h1>
        </div>
      </div>

      {/* Center - Search Input */}
      <div ref={searchRef} className="relative w-full max-w-lg min-w-48 mx-4">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search songs, artists..."
            className="w-full bg-zinc-800/70 hover:bg-zinc-800 focus:bg-zinc-800 text-white pl-9 pr-4 py-2 rounded-full border border-zinc-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Search Results Dropdown */}
        {filteredSongs.length > 0 && (
          <div
            className="absolute w-full bg-zinc-800 border border-zinc-700 mt-2 rounded-lg max-h-96 overflow-y-auto z-50 shadow-xl animate-fadeIn"
            style={{ top: "100%", left: 0 }}
          >
            {filteredSongs.map((song, index) => {
              const isPlayingSong = currentSong?.songId === song.songId;

              return (
                <div
                  key={index}
                  className={`group flex items-center p-3 hover:bg-zinc-700 transition duration-300 cursor-pointer ${
                    isPlayingSong ? "bg-zinc-700/40" : ""
                  }`}
                  onClick={() => {
                    handleSongSelect(song, false);
                    setSearchQuery(""); // Clear search on selection
                  }}
                >
                  <div className="relative w-12 h-12 mr-3 flex-shrink-0">
                    <img
                      className="w-full h-full rounded-md object-cover"
                      src={song.songImage}
                      alt={song.songName}
                    />
                    <div className={`absolute inset-0 flex items-center justify-center rounded-md ${
                      isPlayingSong ? 'bg-black/50' : 'bg-black/30 opacity-0 group-hover:opacity-100'
                    } transition-opacity duration-300`}>
                      {isPlayingSong ? (
                        <GiSoundWaves className="text-blue-400" size={24} />
                      ) : (
                        <FaPlay className="text-white" size={14} />
                      )}
                    </div>
                  </div>
                  <div>
                    <div className={`font-medium group-hover:text-blue-400 transition-colors duration-300 ${
                      isPlayingSong ? "text-blue-400" : "text-white"
                    }`}>
                      {song.songName}
                    </div>
                    <div className="text-xs text-zinc-400">{song.songName.split(" ").slice(0, 2).join(" ")}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Right - Profile */}
      <div ref={profileRef} className="relative">
        <div 
          className="flex items-center bg-zinc-800/70 hover:bg-zinc-800 px-3 py-1.5 rounded-full border border-zinc-700 cursor-pointer transition-all duration-200"
          onClick={() => setShowProfileMenu(!showProfileMenu)}
        >
          <img
            src={Profile}
            alt="Profile"
            className="w-7 h-7 rounded-full ring-2 ring-blue-500/30"
          />
          <span className="ml-2 text-sm font-medium max-w-28 truncate hidden sm:block">{user?.username || "User"}</span>
        </div>

        {showProfileMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl overflow-hidden animate-fadeIn z-50">
            <div className="p-3 border-b border-zinc-700">
              <div className="font-medium">{user?.username || "User"}</div>
              <div className="text-xs text-zinc-400 truncate">{user?.email || "user@example.com"}</div>
            </div>
            <div>
              <button 
                className="w-full text-left px-4 py-2.5 hover:bg-zinc-700 flex items-center gap-2 transition-colors duration-200"
                onClick={() => navigate("/profile")}
              >
                <img src={Profile} alt="Profile" className="w-4 h-4" />
                <span>Profile</span>
              </button>
              <button 
                className="w-full text-left px-4 py-2.5 hover:bg-zinc-700 flex items-center gap-2 text-red-400 transition-colors duration-200"
                onClick={handleLogout}
              >
                <IoMdLogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
