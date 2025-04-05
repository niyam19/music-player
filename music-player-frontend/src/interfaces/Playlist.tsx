import Song from "./Song";

interface Playlist {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  imageUrl?: string;
  songs: Song[];
}

export default Playlist; 