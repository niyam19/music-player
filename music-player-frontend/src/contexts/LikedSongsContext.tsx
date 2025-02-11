import { createContext, useContext, useEffect, useState } from "react";
import LikedSongsContextType from "../interfaces/LikedSongsType";
import Song from "../interfaces/Song";
import { API_URL } from "../constants/apiEnum";

const LikedSongsContext = createContext<LikedSongsContextType | undefined>(
  undefined
);

export const useLikedSongs = () => {
  const context = useContext(LikedSongsContext);
  if (!context) {
    throw new Error("useLikedSongs must be used within a LikedSongsProvider");
  }
  return context;
};

export const LikedSongsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("User not logged in");
    return;
  }

  const [likedSongs, setLikedSongs] = useState<Song[]>([]);

  useEffect(() => {
    getLikedSongs();
    console.log("Liked songs", likedSongs);
  }, []);

  const toggleLike = (song: Song) => {
    toggleLikedSong(song);
  };

  const getLikedSongs = async () => {
    const response = await fetch(`${API_URL}/liked-songs`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch liked songs");
    }
    const data = await response.json();
      console.log("Fetched liked songs:", data);

      setLikedSongs(data);
  };

  const toggleLikedSong = async (song: Song) => {
    const response = await fetch(`${API_URL}/liked-songs`, {
      method: likedSongs.some((s) => s.songId === song.songId)
        ? "DELETE"
        : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(song),
    });   
    if (!response.ok) {
      throw new Error("Failed to add song to liked songs");
    }
    getLikedSongs();
  };

  return (
    <LikedSongsContext.Provider value={{ likedSongs, toggleLike }}>
      {children}
    </LikedSongsContext.Provider>
  );
};
