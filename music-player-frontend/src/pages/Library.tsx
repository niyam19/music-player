import { useState } from 'react';
import { useAudioContext } from "../contexts/AudioContext";
import { MdAccessTime, MdLibraryMusic } from "react-icons/md";
import { FaPlay, FaPause } from "react-icons/fa";
import NoSongsFound from "../components/NoSongsFound";
import { SongContextMenuButton } from '../components/SongContextMenu';

const Library = () => {
  const {
    songs,
    togglePlay,
    handleSongSelect,
    currentSong,
    isPlaying,
    songDurations,
  } = useAudioContext();
  
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredSongs = songs.filter(song => 
    song.songName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePlayAll = () => {
    if (filteredSongs.length > 0) {
      handleSongSelect(filteredSongs[0]);
    }
  };

  return (
    <div className="h-[calc(100vh-136px)] overflow-y-auto px-6 py-6 custom-scrollbar">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end gap-6 mb-8">
        <div className="w-48 h-48 bg-gradient-to-br from-purple-500 to-blue-700 flex items-center justify-center rounded-lg shadow-xl">
          <MdLibraryMusic className="text-white text-6xl" />
        </div>
        <div className="flex-1">
          <div className="text-sm uppercase tracking-wider text-zinc-400 font-semibold">Collection</div>
          <h1 className="text-5xl font-bold text-white mb-3">Your Library</h1>
          <div className="text-zinc-400 flex items-center gap-1">
            <span className="text-sm font-medium">{songs.length} songs</span>
          </div>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
        <div className="flex space-x-4">
          {songs.length > 0 && (
            <button 
              onClick={handlePlayAll}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-8 py-3 flex items-center gap-2 transition-all duration-300 shadow-lg"
            >
              <FaPlay className="text-sm" /> 
              <span className="font-medium">Play All</span>
            </button>
          )}
        </div>
        
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search songs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2 px-4 pl-10 bg-zinc-800/50 border border-zinc-700/50 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
          />
          <svg 
            className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 transform -translate-y-1/2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {filteredSongs.length > 0 ? (
        <div className="bg-zinc-900/40 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-700/50">
                <th className="py-4 px-4 w-10 text-zinc-400 font-medium">#</th>
                <th className="py-4 px-4 text-zinc-400 font-medium">Title</th>
                <th className="py-4 px-4 w-20 text-zinc-400 font-medium text-right">
                  <MdAccessTime size={20} />
                </th>
                <th className="py-4 px-4 w-16 text-zinc-400 font-medium text-center">
                  Options
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSongs.map((song, index) => {
                const handlePlay = () => {
                  if (isSelected) {
                    togglePlay();
                  } else {
                    handleSongSelect(song);
                  }
                };
                const isSelected = currentSong?.songId === song?.songId;
                const isHovered = hoveredIndex === index;

                return (
                  <tr
                    key={song.songId}
                    className={`hover:bg-zinc-800/50 transition duration-200 ${isSelected ? 'bg-zinc-800/70' : ''}`}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onDoubleClick={handlePlay}
                  >
                    <td className="py-3 px-4">
                      {isHovered || isSelected ? (
                        <button 
                          onClick={handlePlay}
                          className="w-6 h-6 flex items-center justify-center text-white"
                        >
                          {isSelected && isPlaying ? (
                            <FaPause size={12} />
                          ) : (
                            <FaPlay size={10} />
                          )}
                        </button>
                      ) : (
                        <span className={`text-sm font-medium ${isSelected ? 'text-blue-500' : 'text-zinc-400'}`}>
                          {index + 1}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md overflow-hidden bg-zinc-800 flex-shrink-0">
                          <img
                            src={song.songImage}
                            alt={song.songName}
                            className={`w-full h-full object-cover ${isSelected ? 'opacity-100' : 'group-hover:opacity-80'}`}
                          />
                        </div>
                        <div>
                          <p className={`font-medium ${isSelected ? 'text-blue-500' : 'text-white'}`}>
                            {song.songName}
                          </p>
                          <p className="text-xs text-zinc-400">
                            {song.songName.split(" ").slice(0, 2).join(" ")}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right text-sm text-zinc-400">
                      {songDurations[song.songId]
                        ? new Date(songDurations[song.songId] * 1000)
                            .toISOString()
                            .substr(14, 5)
                        : "--:--"}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <SongContextMenuButton song={song} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <NoSongsFound />
      )}
    </div>
  );
};

export default Library; 