import React, {
  createContext,
  useRef,
  useState,
  useContext,
  useEffect,
} from "react";
import Song from "../interfaces/Song";
import { songs } from "../SongData";
import AudioContextType from "../interfaces/AudioContextType";

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [currentSong, setCurrentSong] = useState<Song>(
    songs[currentSongIndex]
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const playSong = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const [songDurations, setSongDurations] = useState<{ [key: string]: number }>({});

  const fetchDurations = () => {
    const durations: { [key: string]: number } = {};
  
    songs.forEach((song) => {
      const audio = new Audio(song.songUrl);
      audio.onloadedmetadata = () => {
        durations[song.songId] = audio.duration;
        if (Object.keys(durations).length === songs.length) {
          setSongDurations(durations);
        }
      };
    });
  };

  useEffect(() => {
    fetchDurations();
    console.log(songDurations); 
  }, []);

  const handleSongSelect = (song: Song) => {
    const index = songs.findIndex((s: Song) => s?.songId == song?.songId);
    // console.log(index);
    if (index !== -1) {
      setCurrentSongIndex((prev: number) => {
        if (prev == index) {
          pauseSong();
        } else {
          setCurrentSong(song);
          setIsPlaying(true);
        }
        return index;
      });
    }
  };

  const handlePrev = () => {
    setCurrentSongIndex((prev) => {
      const newIndex = prev > 0 ? prev - 1 : songs.length - 1;
      setCurrentSong(songs[newIndex]);
      return newIndex;
    });
  };

  const handleNext = () => {
    setCurrentSongIndex((prev) => {
      const newIndex = prev < songs.length - 1 ? prev + 1 : 0;
      setCurrentSong(songs[newIndex]);
      return newIndex;
    });
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
      setProgress(
        (audioRef.current.currentTime / audioRef.current.duration) * 100 || 0
      );
      if (audioRef.current.currentTime >= audioRef.current.duration) {
        handleNext();
      }
    }
  };

  useEffect(() => {
    console.log("isPlaying updated:", isPlaying);
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      playSong();
      audioRef.current.ontimeupdate = handleProgress;
    }
  }, [currentSong]);

  return (
    <AudioContext.Provider
      value={{
        audioRef,
        songs,
        currentSong,
        setCurrentSong,
        isPlaying,
        togglePlay,
        playSong,
        pauseSong,
        progress,
        handleProgress,
        handleNext,
        handlePrev,
        handleSongSelect,
        songDurations
      }}
    >
      {children}
      <audio ref={audioRef} src={currentSong?.songUrl} />
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
