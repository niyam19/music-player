import { useAudioContext } from "../contexts/AudioContext";
import SongCard from "../components/SongCard";
import { FaHeadphones } from "react-icons/fa";
import { FaRegPlayCircle } from "react-icons/fa";
import { useEffect, useState } from "react";

const Home = () => {
  const { songs, handleSongSelect } = useAudioContext();
  const [recommendedSongs, setRecommendedSongs] = useState<any[]>([]);

  // Function to shuffle an array
  const shuffleArray = (array: any[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Set recommendations once when songs are loaded
  useEffect(() => {
    if (songs.length > 0 && recommendedSongs.length === 0) {
      setRecommendedSongs(shuffleArray(songs).slice(0, 5));
    }
  }, [songs, recommendedSongs.length]);
  
  // Format the current date for the greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };
  
  const handlePlayAll = () => {
    if (songs.length > 0) {
      handleSongSelect(songs[0], true);
    }
  };

  return (
    <div className="h-[calc(100vh-136px)] overflow-y-auto px-6 py-6 custom-scrollbar">
      {/* Welcome Section */}
      <section className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">{getGreeting()}</h1>
        <p className="text-zinc-400">Discover your favorite music</p>
      </section>
      
      {/* Quick Plays */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Your Favorites</h2>
          <button 
            className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition duration-200"
            onClick={handlePlayAll}
          >
            <FaRegPlayCircle />
            <span>Play all</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {songs.slice(0, 6).map((song, index) => (
            <div 
              key={index}
              className="flex items-center bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors duration-200 rounded-lg overflow-hidden cursor-pointer group"
              onClick={() => handleSongSelect(song, false)}
            >
              <img 
                src={song.songImage} 
                alt={song.songName} 
                className="h-16 w-16 object-cover"
              />
              <div className="flex-1 p-3 truncate">
                <div className="font-medium text-white truncate">{song.songName}</div>
                <div className="text-xs text-zinc-400 truncate">{song.songName.split(" ").slice(0, 2).join(" ")}</div>
              </div>
              <div className="pr-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <FaRegPlayCircle size={24} className="text-blue-400" />
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Recommended Section */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Recommended for You</h2>
          <span className="text-sm text-zinc-500">Based on your recent plays</span>
        </div>
        
        <div className="flex overflow-x-auto pb-4 gap-4 custom-scrollbar-horizontal">
          {recommendedSongs.map((song, index) => (
            <div key={index} className="flex-shrink-0">
              <SongCard selectedSong={song} />
            </div>
          ))}
        </div>
      </section>
      
      {/* All Songs Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FaHeadphones />
            All Songs
          </h2>
          <div className="text-sm text-zinc-400">{songs.length} songs</div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 pb-6">
          {songs.map((song, index) => (
            <div key={index} className="cursor-pointer">
              <SongCard selectedSong={song} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
