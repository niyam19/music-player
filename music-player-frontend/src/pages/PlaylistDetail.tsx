import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePlaylist } from '../contexts/PlaylistContext';
import { useAudioContext } from "../contexts/AudioContext";
import { MdAccessTime, MdArrowBack, MdDelete } from 'react-icons/md';
import { FaPlay, FaPause, FaEdit } from 'react-icons/fa';
import { format } from 'date-fns';
import NoSongsFound from '../components/NoSongsFound';
import { toast } from 'react-toastify';

const PlaylistDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getPlaylist, updatePlaylist, removeSongFromPlaylist } = usePlaylist();
  const { handleSongSelect, togglePlay, currentSong, isPlaying, songDurations } = useAudioContext();
  const navigate = useNavigate();

  const [playlist, setPlaylist] = useState(id ? getPlaylist(id) : undefined);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(playlist?.name || '');
  const [editDescription, setEditDescription] = useState(playlist?.description || '');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      const foundPlaylist = getPlaylist(id);
      setPlaylist(foundPlaylist);
      
      if (foundPlaylist) {
        setEditName(foundPlaylist.name);
        setEditDescription(foundPlaylist.description || '');
      } else {
        // If playlist not found, navigate back to playlists
        navigate('/playlists');
        toast.error('Playlist not found');
      }
    }
  }, [id, getPlaylist, navigate]);

  const handleEditSubmit = () => {
    if (!id || !editName.trim()) return;
    
    updatePlaylist(id, editName.trim(), editDescription.trim() || undefined);
    setIsEditing(false);
    
    // Refresh playlist data
    setPlaylist(getPlaylist(id));
  };

  const handleRemoveSong = (songId: number) => {
    if (!id) return;
    
    if (window.confirm('Are you sure you want to remove this song from the playlist?')) {
      removeSongFromPlaylist(id, songId);
      
      // Refresh playlist data
      setPlaylist(getPlaylist(id));
    }
  };

  const handlePlayAll = () => {
    if (playlist && playlist.songs.length > 0) {
      handleSongSelect(playlist.songs[0]);
    }
  };

  if (!playlist) {
    return (
      <div className="h-[calc(100vh-136px)] overflow-y-auto px-6 py-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white">Playlist not found</h2>
          <button 
            onClick={() => navigate('/playlists')}
            className="mt-4 px-6 py-2 bg-blue-500 rounded-lg text-white"
          >
            Back to Playlists
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-136px)] overflow-y-auto px-6 py-6 custom-scrollbar">
      {/* Back button */}
      <button 
        onClick={() => navigate('/playlists')}
        className="flex items-center text-zinc-400 hover:text-white mb-6 group"
      >
        <MdArrowBack className="mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Playlists
      </button>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end gap-6 mb-8">
        <div className="w-48 h-48 rounded-lg shadow-xl overflow-hidden bg-zinc-800">
          {playlist.imageUrl ? (
            <img 
              src={playlist.imageUrl} 
              alt={playlist.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-blue-500">
              <span className="text-white text-5xl font-bold">{playlist.name.charAt(0)}</span>
            </div>
          )}
        </div>
        
        {isEditing ? (
          <div className="flex-1">
            <div className="text-sm uppercase tracking-wider text-zinc-400 font-semibold mb-2">Playlist</div>
            <div className="mb-3">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="bg-zinc-800/70 border border-zinc-700 rounded-lg p-2.5 text-white text-3xl font-bold w-full mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="Playlist Name"
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="bg-zinc-800/70 border border-zinc-700 rounded-lg p-2.5 text-white w-full focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
                placeholder="Add an optional description"
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleEditSubmit}
                className="px-5 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-5 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-white font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1">
            <div className="text-sm uppercase tracking-wider text-zinc-400 font-semibold">Playlist</div>
            <h1 className="text-5xl font-bold text-white mb-1">{playlist.name}</h1>
            {playlist.description && (
              <p className="text-zinc-400 mb-3">{playlist.description}</p>
            )}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-zinc-400 text-sm">
              <div>
                Created {format(new Date(playlist.createdAt), 'MMM d, yyyy')}
              </div>
              <div className="flex items-center gap-1">
                <span>{playlist.songs.length} {playlist.songs.length === 1 ? 'song' : 'songs'}</span>
              </div>
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors"
              >
                <FaEdit size={14} />
                <span>Edit</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {!isEditing && playlist.songs.length > 0 && (
        <div className="flex mb-6">
          <button 
            onClick={handlePlayAll}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-8 py-3 flex items-center gap-2 transition-all duration-300 shadow-lg"
          >
            <FaPlay className="text-sm" /> 
            <span className="font-medium">Play All</span>
          </button>
        </div>
      )}

      {/* Songs Table */}
      {playlist.songs.length > 0 ? (
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
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {playlist.songs.map((song, index) => {
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
                    key={`${song.songId}-${index}`}
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
                            className="w-full h-full object-cover"
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
                      <button 
                        onClick={() => handleRemoveSong(song.songId)}
                        className="text-zinc-500 hover:text-red-500 transition-colors"
                        title="Remove from playlist"
                      >
                        <MdDelete size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-8">
          <NoSongsFound />
        </div>
      )}
    </div>
  );
};

export default PlaylistDetail; 