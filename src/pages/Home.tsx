import { useAudioContext } from "../contexts/AudioContext";
import SongCard from "../components/SongCard";

const Home = () => {
  const { songs } = useAudioContext();

  return (
    <div className="flex flex-wrap justify-center gap-4 p-4">
      {songs.map((song, index) => (
        <div key={index} className="cursor-pointer">
          <SongCard selectedSong={song} />
        </div>
      ))}
    </div>
  );
};

export default Home;
