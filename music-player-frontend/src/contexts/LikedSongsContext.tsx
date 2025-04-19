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
  const [likedSongsSet, setLikedSongsSet] = useState(new Set<number>());

  useEffect(() => {
    getLikedSongs();
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
      const likedSet = new Set<number>(data.map((song: { songId: number }) => song.songId));
      setLikedSongs(data);
      setLikedSongsSet(likedSet);
  };

  const toggleLikedSong = async (song: Song) => {
    toast.dismiss();
    const updatedSet = new Set(likedSongsSet);
    try {
      const response = await fetch(`${API_URL}/liked-songs`, {
        method: updatedSet.has(song.songId) ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(song),
      });
      if (response.status === 401) {
        localStorage.removeItem("token");
        toast.error('Session expired! Please login again')
        navigate("/login", { replace: true });
      }
      if (!response.ok) {
        throw new Error("Failed to update liked songs");
      }
      if (updatedSet.has(song.songId)) {
        updatedSet.delete(song.songId);
        const index = likedSongs.findIndex(s => s.songId === song.songId);
        if (index > -1) likedSongs.splice(index, 1);
        toast.success("Song has been removed from your library");
      } else {
        updatedSet.add(song.songId);
        likedSongs.push(song);
        toast.success("Song added to your library");
      }
      setLikedSongsSet(updatedSet);
    } catch (error) {
      toast.error("An error occurred while updating liked songs");
    }
  };

  return (
    <LikedSongsContext.Provider value={{ likedSongs, toggleLikedSong, likedSongsSet }}>
      {children}
    </LikedSongsContext.Provider>
  );
};
