import Song from "./Song";

interface LikedSongsContextType {
  likedSongs: Song[];
  toggleLikedSong: (song: Song) => void;
  likedSongsSet: Set<number>;
}

export default LikedSongsContextType;
