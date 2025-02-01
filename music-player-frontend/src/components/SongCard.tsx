import React, { useState } from "react";
import { IoHeartSharp } from "react-icons/io5";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa6";
import Song from "../interfaces/Song";
import { useAudioContext } from "../contexts/AudioContext";
import { useLikedSongs } from "../contexts/LikedSongsContext";

const SongCard: React.FC<{
  selectedSong: Song;
}> = ({ selectedSong }) => {
  const [isHovered, setIsHovered] = useState(false);
  // const [isLiked, setIsLiked] = useState(false);
  const {togglePlay, handleSongSelect, currentSong, isPlaying} = useAudioContext();
  const {toggleLike, likedSongs} = useLikedSongs();
  const isLiked = likedSongs.some((song) => song.songId === selectedSong.songId);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  const handlePlay = () => {
    if(isSelected){
      togglePlay()
    } else {  
      handleSongSelect(selectedSong, false);
    }
  };

  const isSelected = selectedSong?.songId === currentSong?.songId;

  return (
    <div
      className=" relative max-w-sm w-44 bg-white rounded-lg shadow-md overflow-hidden transition duration-200"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative">
        <img
          src={selectedSong.songImage}
          alt={selectedSong.songName}
          className={`w-full h-44 object-contain transition duration-200 ${
            isHovered ? "filter brightness-50" : ""
          }`}
        />

        <button
          onClick={handlePlay}
          className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full w-12 h-12 mx-auto my-auto hover:bg-opacity-70 text-white transition duration-200 transform hover:scale-125 ${
            isSelected ? "" : "hidden"
          }`}
        >
          {(isSelected && isPlaying) ? <FaPause size={22} /> : <FaPlay size={20} />}
        </button>

        {isHovered && !isSelected && (
          <button
            onClick={handlePlay}
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full w-12 h-12 mx-auto my-auto hover:bg-opacity-70 text-white transition duration-200 transform hover:scale-125"
          >
            <FaPlay size={20} />
          </button>
        )}

        {isHovered && (
          <button
            onClick={() => toggleLike(selectedSong)}
            className={`absolute top-2 left-2 p-1 rounded-full transition duration-200 text-red-500 ${
              isLiked ? "text-red-500" : "text-white"
            }`}
          >
            <IoHeartSharp size={20} />
          </button>
        )}
      </div>

      <div className="p-3">
        <h3
          className="text-sm font-semibold text-gray-900 truncate"
          title={selectedSong.songName}
        >
          {selectedSong.songName}
        </h3>
      </div>
    </div>
  );
};

export default SongCard;
