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
import { API_URL } from "../constants/apiEnum";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return;
  }
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<any>(null); //NEED TO CHECK TYPE TEMPRORY ADDED ANY
  const [songList, setSongList] = useState<Song[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const { likedSongs } = useLikedSongs();
  const [isFirstRender, setIsFirstRender] = useState(true);

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
        const response = await fetch(`${API_URL}/songs`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("userData");
          toast.error('Session expired! Please login again')
          navigate("/login", { replace: true });
        }
        const data = await response.json();
        setSongs(data);
        setSongList(data);
        if (data.length > 0) {
          setCurrentSong(null);
        }
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    };

    fetchSongs();
  }, []);

  const fetchCurrentSong = async () => {
    const userDataFromLocal = localStorage.getItem("userData");
    const userData = userDataFromLocal ? JSON.parse(userDataFromLocal) : null;
    if(!userData.userId) return;

    try {
      const response = await fetch(`${API_URL}/user/current-song/${userData.userId}`);
      const data = await response.json();
      
      if(data.currentSongId){
        const selectedSong = songs.find((song) => song.songId === data.currentSongId);

      if (selectedSong) { 
          setCurrentSong(selectedSong);
      }
      }
      
    } catch (error) {
      console.error("Error fetching song:", error);
      
    }
  }

  useEffect(() => {
    if (songs.length > 0) {
      fetchDurations();
      fetchCurrentSong();
    }
  }, [songs]);

  const handleSongSelect = async (song: Song, fromLikedSongs = false) => {
    const newSongList = fromLikedSongs ? likedSongs : songs;
    if (newSongList !== songList) {
      setSongList(newSongList);
    }
    if (currentSong?.songId === song.songId) {
      return;
    }
    setCurrentSong(song);
    setIsPlaying(true);
    const userDataFromLocal = localStorage.getItem("userData");
    const userData = userDataFromLocal ? JSON.parse(userDataFromLocal) : null;

    try {
      await fetch(`${API_URL}/user/update-song`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          userId: userData.userId,
          songId: song.songId,
        })
      })
    } catch (error) {
      console.error("Failed to save song state:", error);
    }
  };

  const handlePrev = () => {
    const currentIndex = songList.findIndex((s) => s.songId === currentSong?.songId);
    const newIndex = currentIndex > 0 ? currentIndex - 1 : songList.length - 1;
    setCurrentSong(songList[newIndex]);
  };

  const handleNext = () => {
    const currentIndex = songList.findIndex((s) => s.songId === currentSong?.songId);
    const newIndex = currentIndex < songList.length - 1 ? currentIndex + 1 : 0;
    setCurrentSong(songList[newIndex]);
  };

  const pauseSong = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    isPlaying ? pauseSong() : playSong();
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
    if (audioRef.current) {
      audioRef.current.volume = 0.3; // Set max volume
    }
  }, []);

  useEffect(() => {
    if (!audioRef.current?.currentSrc) return;
  
    audioRef.current.load();
    audioRef.current.ontimeupdate = handleProgress;
  
    if (isFirstRender) {
      setIsFirstRender(false);
    } else {
      playSong();
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
