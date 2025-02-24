import { createContext, useContext, useEffect, useState } from "react";
import LikedSongsContextType from "../interfaces/LikedSongsType";
import Song from "../interfaces/Song";
import { API_URL } from "../constants/apiEnum";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

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
    return;
  }
  const navigate = useNavigate();
  const [likedSongs, setLikedSongs] = useState<Song[]>([]);

  useEffect(() => {
    getLikedSongs();
    console.log("Liked songs", likedSongs);
  }, []);

  const getLikedSongs = async () => {
    const response = await fetch(`${API_URL}/liked-songs`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      if (response.status === 404) {
        setLikedSongs([]);
        return;
      }
      throw new Error("Failed to fetch liked songs");
    }
    const data = await response.json();
      console.log("Fetched liked songs:", data);

      setLikedSongs(data);
  };

  const toggleLikedSong = async (song: Song) => {
    toast.dismiss();
    const isLiked = likedSongs.some((s) => s.songId === song.songId);
    try {
      const response = await fetch(`${API_URL}/liked-songs`, {
        method: isLiked ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(song),
      });
      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        toast.error('Session expired! Please login again')
        navigate("/login", { replace: true });
      }
      if (!response.ok) {
        throw new Error("Failed to update liked songs");
      }
      
      getLikedSongs();
      if (isLiked) {
        toast.success("Song has been removed from your library");
      } else {
        toast.success("Song added to your library");
      }
    } catch (error) {
      toast.error("An error occurred while updating liked songs");
    }
  };

  return (
    <LikedSongsContext.Provider value={{ likedSongs, toggleLikedSong }}>
      {children}
    </LikedSongsContext.Provider>
  );
};
