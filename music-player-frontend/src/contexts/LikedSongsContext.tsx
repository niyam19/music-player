import { createContext, useContext, useEffect, useState } from "react";
import LikedSongsContextType from "../interfaces/LikedSongsType";
import Song from "../interfaces/Song";

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
  const [likedSongs, setLikedSongs] = useState<Song[]>([]);

  const toggleLike = (song: Song) => {
    setLikedSongs((prev) => {
      return prev.some((s) => s.songId === song.songId)
        ? prev.filter((s) => s.songId !== song.songId)
        : [...prev, song];
    });
  };

  useEffect(() => {
    console.log("Liked songs",likedSongs);
  }, [likedSongs])


  return(
    <LikedSongsContext.Provider value={{ likedSongs, toggleLike }}>
        {children}
    </LikedSongsContext.Provider>
  )
};
