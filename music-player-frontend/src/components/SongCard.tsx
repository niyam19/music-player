import React, { useState } from "react";
import { IoHeartSharp, IoHeartOutline } from "react-icons/io5";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa6";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import Song from "../interfaces/Song";
import { useAudioContext } from "../contexts/AudioContext";
import { useLikedSongs } from "../contexts/LikedSongsContext";

const SongCard: React.FC<{
  selectedSong: Song;
}> = ({ selectedSong }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { togglePlay, handleSongSelect, currentSong, isPlaying } = useAudioContext();
  const { toggleLikedSong, likedSongs } = useLikedSongs();
  const isLiked = likedSongs.some((song) => song.songId === selectedSong.songId);
  const isSelected = selectedSong?.songId === currentSong?.songId;

  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!showMenu) {
      setShowMenu(false);
    }
  };
  
  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSelected) {
      togglePlay();
    } else {
      handleSongSelect(selectedSong, false);
    }
  };

  const handleToggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLikedSong(selectedSong);
  };

  const handleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  return (
    <div
      className="relative group w-full bg-zinc-800/40 hover:bg-zinc-700/50 rounded-lg overflow-hidden transition-all duration-300 transform hover:translate-y-[-4px] hover:shadow-xl"
      style={{ maxWidth: "180px" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handlePlay}
    >
      <div className="relative">
        <div className="aspect-square overflow-hidden rounded-t-lg">
          <img
            src={selectedSong.songImage}
            alt={selectedSong.songName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        <div 
          className={`absolute inset-0 flex items-center justify-center ${
            isSelected || isHovered ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-300 bg-black/40`}
        >
          <button 
            onClick={handlePlay}
            className={`flex items-center justify-center bg-blue-500 rounded-full w-12 h-12 text-white shadow-lg transform transition-all duration-200 ${
              isHovered && !isSelected ? 'scale-90 hover:scale-100' : 'scale-100'
            }`}
          >
            {(isSelected && isPlaying) ? <FaPause size={18} /> : <FaPlay size={18} className="ml-1" />}
          </button>
        </div>

        {(isHovered || isLiked) && (
          <button
            onClick={handleToggleLike}
            className="absolute top-2 left-2 p-2 rounded-full bg-black/30 backdrop-blur-sm text-2xl transition-transform duration-200 hover:scale-110 z-10"
          >
            {isLiked ? (
              <IoHeartSharp className="text-blue-500" />
            ) : (
              <IoHeartOutline className="text-white" />
            )}
          </button>
        )}

        {isHovered && (
          <button
            onClick={handleMenu}
            className="absolute top-2 right-2 p-2 rounded-full bg-black/30 backdrop-blur-sm transition-transform duration-200 hover:scale-110 z-10"
          >
            <BiDotsHorizontalRounded className="text-white text-xl" />
          </button>
        )}

        {showMenu && (
          <div className="absolute top-12 right-2 bg-zinc-800 border border-zinc-700 rounded-md shadow-xl z-20 overflow-hidden">
            <ul className="text-sm">
              <li className="hover:bg-zinc-700 transition-colors duration-200">
                <button className="px-4 py-2 w-full text-left">Add to playlist</button>
              </li>
              <li className="hover:bg-zinc-700 transition-colors duration-200">
                <button className="px-4 py-2 w-full text-left">Add to queue</button>
              </li>
              <li className="hover:bg-zinc-700 transition-colors duration-200">
                <button className="px-4 py-2 w-full text-left">Share</button>
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className="p-3">
        <h3
          className={`font-medium text-sm truncate ${
            isSelected ? "text-blue-400" : "text-white"
          }`}
          title={selectedSong.songName}
        >
          {selectedSong.songName}
        </h3>
        <p className="text-xs text-zinc-400 mt-1 truncate">
          {selectedSong.songName.split(" ").slice(0, 2).join(" ")}
        </p>
      </div>
    </div>
  );
};

export default SongCard;
