import React, { useState } from "react";
import {
  TbPlayerPlayFilled,
  TbPlayerPauseFilled,
  TbPlayerSkipBackFilled,
  TbPlayerSkipForwardFilled,
} from "react-icons/tb";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { useAudioContext } from "../contexts/AudioContext";
import { IoHeartSharp } from "react-icons/io5";
import { useLikedSongs } from "../contexts/LikedSongsContext";

const Player = () => {
  const {
    audioRef,
    isPlaying,
    togglePlay,
    progress,
    handlePrev,
    handleNext,
    currentSong,
  } = useAudioContext();
  const { toggleLikedSong, likedSongs } = useLikedSongs();
  const isLiked = likedSongs?.some(
    (song) => song?.songId === currentSong?.songId
  );
  const [volume, setVolume] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(volume);
  const [hoverTime, setHoverTime] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [mouseX, setMouseX] = useState(0);
  const [progressBarWidth, setProgressBarWidth] = useState(0);

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      audioRef.current.currentTime =
        (parseFloat(e.target.value) / 100) * audioRef.current.duration;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (!isMuted) {
        setPreviousVolume(audioRef.current.volume);
        audioRef.current.volume = 0.0;
        setVolume(0.0);
      } else {
        audioRef.current.volume = previousVolume;
        setVolume(previousVolume);
      }
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const newProgressBarWidth = e.currentTarget.offsetWidth;
    setProgressBarWidth(newProgressBarWidth);

    const newMouseX = e.nativeEvent.offsetX;
    const newHoverTime =
      (newMouseX / progressBarWidth) * (audioRef.current?.duration || 0);
    setMouseX(newMouseX);
    setHoverTime(newHoverTime);
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <>
      <div
        className="fixed bottom-[56px] w-full z-10"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <input
          type="range"
          value={progress}
          onChange={handleSeek}
          className="w-full min-w-36 h-1 bg-gray-700 rounded-lg appearance-none"
        />
        {isHovering && hoverTime > 0 && mouseX > 20 && (
          <div
            className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 bg-black text-white text-xs p-1 rounded"
            style={{
              left: `${(mouseX / progressBarWidth) * 100}%`,
            }}
          >
            {formatTime(hoverTime)}
          </div>
        )}
      </div>
      <div className="fixed bottom-0 left-0 w-full h-16 bg-gray-900 text-white p-4 flex items-center justify-between space-x-2">
        <div className="flex items-center space-x-2">
          <img
            className="w-10"
            src={currentSong?.songImage}
            alt={currentSong?.songName}
          />
          <span>{currentSong?.songName}</span>
          <button
            onClick={() => toggleLikedSong(currentSong)}
            className={`rounded-full transition duration-200 text-red-500 ${
              isLiked ? "text-red-500" : "text-white"
            }`}
          >
            <IoHeartSharp size={20} />
          </button>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center space-x-2">
          <button onClick={handlePrev} className="text-4xl">
            <TbPlayerSkipBackFilled />
          </button>
          <button onClick={togglePlay} className="text-5xl">
            {isPlaying ? <TbPlayerPauseFilled /> : <TbPlayerPlayFilled />}
          </button>
          <button onClick={handleNext} className="text-4xl">
            <TbPlayerSkipForwardFilled />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-white text-base mr-2">
            {formatTime(audioRef.current?.currentTime || 0)} /{" "}
            {formatTime(audioRef.current?.duration || 0)}
          </span>
          <span onClick={toggleMute}>
            {!isMuted && volume ? <HiSpeakerWave /> : <HiSpeakerXMark />}
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-20 h-1 bg-gray-700 rounded-lg appearance-none"
          />
        </div>
        <audio ref={audioRef} src={currentSong?.songUrl} />
      </div>
    </>
  );
};

export default Player;
