import React, { useEffect, useState } from "react";
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
  const [isProgressHovering, setIsProgressHovering] = useState(false);
  const [isVolumeHovering, setIsVolumeHovering] = useState(false);
  const [mouseX, setMouseX] = useState(0);
  const [progressBarWidth, setProgressBarWidth] = useState(0);

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current?.currentSrc) {
      audioRef.current.currentTime =
        (parseFloat(e.target.value) / 100) * audioRef.current.duration;
    }
  };

  useEffect(() => {
    if (volume == 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  }, [volume]);

  const toggleMute = () => {
    if (audioRef.current?.currentSrc) {
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
    const maxVolume = 0.3; // Adjust this to set the highest allowed volume

    const scaledVolume = newVolume * maxVolume; // Scale down the volume
    setVolume(newVolume);

    if (audioRef.current) {
      audioRef.current.volume = scaledVolume; // Apply the restricted volume
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
    setIsProgressHovering(true);
  };

  const handleMouseLeave = () => {
    setIsProgressHovering(false);
  };

  return (
    <>
      <div className="fixed bottom-[56px] w-full z-10">
        <input
          type="range"
          value={progress}
          onChange={handleSeek}
          className="w-full min-w-36 h-1 rounded-lg appearance-none"
          style={{
            background: `linear-gradient(to right, ${
              isProgressHovering ? "#60a5fa" : "white"
            } 0%, ${
              isProgressHovering ? "#60a5fa" : "white"
            } ${progress}%, #3f3f46 ${progress}%, #3f3f46 100%)`,
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />

        {isProgressHovering && hoverTime > 0 && (
          <div
            className="absolute top-[-20px] bg-black text-white text-xs p-1 rounded"
            style={{
              left: `${Math.min(
                Math.max((mouseX / progressBarWidth) * 100, 5),
                95
              )}%`,
              transform: "translateX(-50%)",
              whiteSpace: "nowrap",
            }}
          >
            {formatTime(hoverTime)}
          </div>
        )}
      </div>
      <div className="fixed bottom-0 left-0 w-full h-16 bg-black text-white p-4 flex items-center justify-between space-x-2">
        <div className="flex items-center space-x-2">
          <img
            className="w-10"
            src={currentSong?.songImage}
            alt={currentSong?.songName}
          />
          <span>{currentSong?.songName}</span>
          {currentSong && <button
            onClick={() => toggleLikedSong(currentSong)}
            className={`rounded-full transition duration-200 text-red-500 ${
              isLiked ? "text-red-500" : "text-white"
            }`}
          >
            <IoHeartSharp size={20} />
          </button>}
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center space-x-2">
          <button onClick={handlePrev} className="text-4xl disabled:opacity-50" disabled={!currentSong}>
            <TbPlayerSkipBackFilled />
          </button>
          <button onClick={togglePlay} className="text-5xl disabled:opacity-50" disabled={!currentSong}>
            {isPlaying ? <TbPlayerPauseFilled /> : <TbPlayerPlayFilled />}
          </button>
          <button onClick={handleNext} className="text-4xl disabled:opacity-50" disabled={!currentSong}>
            <TbPlayerSkipForwardFilled />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          {currentSong && <span className="text-white text-base mr-2">
            {formatTime(audioRef.current?.currentTime || 0)} /{" "}
            {formatTime(audioRef.current?.duration || 0)}
          </span>}
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
            className="w-20 h-1 appearance-none rounded-lg"
            style={{
              background: `linear-gradient(to right, ${
                isVolumeHovering ? "#60a5fa" : "white"
              } 0%, ${isVolumeHovering ? "#60a5fa" : "white"} ${
                volume * 100
              }%, #3f3f46 ${volume * 100}%, #3f3f46 100%)`,
            }}
            onMouseEnter={() => setIsVolumeHovering(true)}
            onMouseLeave={() => setIsVolumeHovering(false)}
          />
        </div>
        <audio ref={audioRef} src={currentSong?.songUrl} />
      </div>
    </>
  );
};

export default Player;
