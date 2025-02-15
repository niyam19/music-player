import Song from "./Song";

interface LikedSongsContextType {
  likedSongs: Song[];
  toggleLikedSong: (song: Song) => void;
}

export default LikedSongsContextType;
