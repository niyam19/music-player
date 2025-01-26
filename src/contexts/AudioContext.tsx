import React, { createContext, useRef, useState, useContext } from "react";

type AudioContextType = {
  audioRef: React.RefObject<HTMLAudioElement>;
  currentSong: string | null;
  setCurrentSong: (song: string) => void;
  isPlaying: boolean;
  togglePlay: () => void;
  playSong: () => void;
  pauseSong: () => void;
  handleProgress: () => number;
  progress: number;
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentSong, setCurrentSong] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const playSong = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseSong = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      pauseSong();
    } else {
      playSong();
    }
  };

  const handleProgress = () => {
    if (audioRef.current) {
      const currentProgress =
        (audioRef.current.currentTime / audioRef.current.duration) * 100 || 0;
      setProgress(currentProgress);
    }
    return progress;
  };

  return (
    <AudioContext.Provider
      value={{
        audioRef,
        currentSong,
        setCurrentSong,
        isPlaying,
        togglePlay,
        playSong,
        pauseSong,
        handleProgress,
        progress,
      }}
    >
      {children}
      <audio ref={audioRef} onTimeUpdate={handleProgress} />
    </AudioContext.Provider>
  );
};

export const useAudioContext = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudioContext must be used within an AudioProvider");
  }
  return context;
};
