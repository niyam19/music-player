import React, {
  createContext,
  useRef,
  useState,
  useContext,
  useEffect,
} from "react";
import Song from "../interfaces/Song";
import AudioContextType from "../interfaces/AudioContextType";
import { useLikedSongs } from "./LikedSongsContext";

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [currentSong, setCurrentSong] = useState<any>(null); //NEED TO CHECK TYPE TEMPRORY ADDED ANY
  const [songList, setSongList] = useState<Song[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const { likedSongs } = useLikedSongs();

  const playSong = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const [songDurations, setSongDurations] = useState<{ [key: string]: number }>(
    {}
  );

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
    const fetchSongs = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/songs");
        const data = await response.json();
        setSongs(data);
        setSongList(data);
        if (data.length > 0) {
          setCurrentSong(data[0]);
        }
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    };

    fetchSongs();
  }, []);
  useEffect(() => {
    if (songs.length > 0) {
      fetchDurations();
    }
  }, [songs]);
  

  const handleSongSelect = (song: Song, fromLikedSongs = false) => {
    fromLikedSongs ? setSongList(likedSongs) : setSongList(songs);
    const index = songList.findIndex((s: Song) => s?.songId == song?.songId);
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
      const newIndex = prev > 0 ? prev - 1 : songList.length - 1;
      setCurrentSong(songList[newIndex]);
      return newIndex;
    });
  };

  const handleNext = () => {
    setCurrentSongIndex((prev) => {
      const newIndex = prev < songList.length - 1 ? prev + 1 : 0;
      setCurrentSong(songList[newIndex]);
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
        songDurations,
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
