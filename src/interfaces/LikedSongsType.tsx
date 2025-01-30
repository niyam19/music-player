import Song from "./Song";

interface LikedSongsContextType {
  likedSongs: Song[];
  toggleLike: (song: Song) => void;
}

export default LikedSongsContextType;
