import React, { useEffect, useState, useRef } from "react";
import {
  TbPlayerPlayFilled,
  TbPlayerPauseFilled,
  TbPlayerSkipBackFilled,
  TbPlayerSkipForwardFilled,
} from "react-icons/tb";
import { IoShuffle, IoRepeat } from "react-icons/io5";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { useAudioContext } from "../contexts/AudioContext";
import { IoHeartSharp, IoHeartOutline } from "react-icons/io5";
import { useLikedSongs } from "../contexts/LikedSongsContext";
import { BiSolidPlaylist } from "react-icons/bi";

const Player = () => {
  const {
    audioRef,
    isPlaying,
    togglePlay,
    progress,
    handlePrev,
    handleNext,
    currentSong,
    setProgress,
    toggleShuffle,
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
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressContainerRef = useRef<HTMLDivElement>(null);
  const [progressBarWidth, setProgressBarWidth] = useState(0);
  
  // Initialize shuffle and repeat states
  const [isShuffle, setIsShuffle] = useState(() => {
    return localStorage.getItem('isShuffle') === 'true';
  });
  const [isRepeat, setIsRepeat] = useState(false);

  // Update progress bar width when component mounts or window resizes
  useEffect(() => {
    const updateProgressBarWidth = () => {
      if (progressContainerRef.current) {
        setProgressBarWidth(progressContainerRef.current.offsetWidth);
      }
    };

    updateProgressBarWidth();
    window.addEventListener('resize', updateProgressBarWidth);
    
    return () => {
      window.removeEventListener('resize', updateProgressBarWidth);
    };
  }, []);

  // Sync shuffle state with localStorage
  useEffect(() => {
    localStorage.setItem('isShuffle', isShuffle.toString());
  }, [isShuffle]);

  // Implement repeat functionality
  useEffect(() => {
    const handleEnded = () => {
      if (isRepeat && audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      } else {
        handleNext();
      }
    };

    if (audioRef.current) {
      audioRef.current.addEventListener('ended', handleEnded);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleEnded);
      }
    };
  }, [isRepeat, handleNext, audioRef]);

  const formatTime = (timeInSeconds: number): string => {
    if (isNaN(timeInSeconds)) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  // Handle input range change (dragging)
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current?.currentSrc) {
      const value = parseFloat(e.target.value);
      const newTime = (value / 100) * (audioRef.current.duration || 0);
      audioRef.current.currentTime = newTime;
      setProgress(value);
    }
  };

  // Handle direct click on progress bar
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current?.duration || !progressContainerRef.current) return;
    
    const rect = progressContainerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = (clickX / rect.width) * 100;
    
    // Ensure percentage is between 0 and 100
    const clampedPercentage = Math.max(0, Math.min(percentage, 100));
    
    // Update audio time
    audioRef.current.currentTime = (clampedPercentage / 100) * audioRef.current.duration;
    
    // Also update progress state
    setProgress(clampedPercentage);
  };

  useEffect(() => {
    if (volume === 0) {
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
    if (!audioRef.current?.duration || !progressContainerRef.current) return;
    
    // Calculate position relative to the progress bar
    const rect = progressContainerRef.current.getBoundingClientRect();
    const newMouseX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const newHoverTimePercentage = newMouseX / rect.width;
    const newHoverTime = newHoverTimePercentage * audioRef.current.duration;
    
    setMouseX(newMouseX);
    setHoverTime(newHoverTime);
    setIsProgressHovering(true);
  };

  const handleMouseLeave = () => {
    setIsProgressHovering(false);
  };

  // Handle shuffle toggle
  const handleToggleShuffle = () => {
    toggleShuffle(); // Use the method from AudioContext
    setIsShuffle(!isShuffle); // Update local UI state
  };

  return (
    <>
      {currentSong && (
        <div className="fixed bottom-[72px] w-full z-10 px-4">
          <div 
            ref={progressContainerRef}
            className="flex items-center w-full"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="text-xs text-zinc-400 w-12 text-right mr-2">
              {formatTime(audioRef.current?.currentTime || 0)}
            </div>
            
            {/* Progress Bar Container */}
            <div 
              ref={progressBarRef} 
              className="relative flex-1 h-6 cursor-pointer z-20" 
              onClick={handleProgressClick}
            >
              {/* Background Track */}
              <div className="absolute w-full h-4 bg-zinc-700 rounded-full overflow-hidden top-1/2 transform -translate-y-1/2">
                {/* Progress Fill */}
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-150"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              {/* Drag Handle */}
              <div 
                className="absolute h-6 w-6 bg-white rounded-full shadow-md top-1/2 transform -translate-y-1/2"
                style={{ 
                  left: `calc(${progress}% - 12px)`,
                  display: isProgressHovering || (progressContainerRef.current === document.activeElement) ? 'block' : 'none'
                }}
              ></div>
              
              {/* Hidden Input Range for Accessibility */}
              <input
                type="range"
                value={progress}
                onChange={handleSeek}
                className="w-full h-6 absolute top-0 left-0 opacity-0 cursor-pointer z-30"
                min={0}
                max={100}
                step={0.1}
              />

              {/* Time Tooltip */}
              {isProgressHovering && audioRef.current?.duration && (
                <div 
                  className="absolute h-8 w-16 bg-blue-500 rounded-md -top-10 transform -translate-x-1/2 flex items-center justify-center shadow-lg"
                  style={{ left: `${mouseX}px` }}
                >
                  <div className="text-xs text-white font-medium">
                    {formatTime(hoverTime)}
                  </div>
                </div>
              )}
            </div>
            
            <div className="text-xs text-zinc-400 w-12 ml-2">
              {formatTime(audioRef.current?.duration || 0)}
            </div>
          </div>
        </div>
      )}
      
      <div className="fixed bottom-0 left-0 w-full h-[72px] bg-black/90 backdrop-blur-md border-t border-zinc-800/50 text-white flex items-center justify-between p-4">
        {/* Left - Song Info */}
        <div className="flex items-center space-x-4 w-1/4">
          {currentSong ? (
            <>
              <div className="relative group">
                <img
                  className="w-12 h-12 rounded-md object-cover shadow-md"
                  src={currentSong.songImage}
                  alt={currentSong.songName}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-md transition-opacity duration-200 flex items-center justify-center">
                  <BiSolidPlaylist size={20} className="text-white cursor-pointer" />
                </div>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="font-medium text-sm truncate max-w-[140px] sm:max-w-xs">
                  {currentSong.songName}
                </div>
                <div className="text-xs text-zinc-400 truncate max-w-[140px] sm:max-w-xs">
                  {currentSong.songName.split(" ").slice(0, 2).join(" ")}
                </div>
              </div>
              <button
                onClick={() => currentSong && toggleLikedSong(currentSong)}
                className="text-2xl transition duration-300 transform hover:scale-110"
              >
                {isLiked ? (
                  <IoHeartSharp className="text-blue-500" />
                ) : (
                  <IoHeartOutline className="text-zinc-400 hover:text-blue-500" />
                )}
              </button>
            </>
          ) : (
            <div className="text-sm text-zinc-400">No song selected</div>
          )}
        </div>
        
        {/* Center - Controls */}
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center justify-center space-x-4">
            <button 
              onClick={handleToggleShuffle}
              className={`text-lg transition duration-200 ${isShuffle ? 'text-blue-500' : 'text-zinc-400 hover:text-white'}`}
              title="Shuffle"
            >
              <IoShuffle />
            </button>
            
            <button 
              onClick={handlePrev} 
              className="text-2xl text-zinc-200 hover:text-white transition duration-200 transform hover:scale-110 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed" 
              disabled={!currentSong}
              title="Previous"
            >
              <TbPlayerSkipBackFilled />
            </button>
            
            <button 
              onClick={togglePlay} 
              className="flex items-center justify-center bg-white text-black rounded-full w-10 h-10 transition duration-300 transform hover:scale-110 hover:bg-blue-400 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed" 
              disabled={!currentSong}
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <TbPlayerPauseFilled size={22} /> : <TbPlayerPlayFilled size={22} />}
            </button>
            
            <button 
              onClick={handleNext} 
              className="text-2xl text-zinc-200 hover:text-white transition duration-200 transform hover:scale-110 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed" 
              disabled={!currentSong}
              title="Next"
            >
              <TbPlayerSkipForwardFilled />
            </button>
            
            <button 
              onClick={() => setIsRepeat(!isRepeat)}
              className={`text-lg transition duration-200 ${isRepeat ? 'text-blue-500' : 'text-zinc-400 hover:text-white'}`}
              title="Repeat"
            >
              <IoRepeat />
            </button>
          </div>
        </div>
        
        {/* Right - Volume */}
        <div className="flex items-center justify-end space-x-3 w-1/4">
          <button
            onClick={toggleMute}
            className="text-zinc-300 hover:text-white transition duration-200"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {!isMuted && volume ? <HiSpeakerWave size={20} /> : <HiSpeakerXMark size={20} />}
          </button>
          
          <div className="relative w-24 sm:w-32 h-5 flex items-center group">
            <div className="absolute w-full h-1 bg-zinc-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-zinc-400 group-hover:bg-blue-500 rounded-full transition-colors duration-300"
                style={{ width: `${volume * 100}%` }}
              ></div>
            </div>
            
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full h-5 absolute opacity-0 cursor-pointer z-10"
              onMouseEnter={() => setIsVolumeHovering(true)}
              onMouseLeave={() => setIsVolumeHovering(false)}
              title="Volume"
            />
            
            <div 
              className="absolute w-3 h-3 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{ left: `calc(${volume * 100}% - 6px)` }}
            ></div>
          </div>
        </div>
      </div>
      
      <audio ref={audioRef} src={currentSong?.songUrl} />
    </>
  );
};

export default Player;
