import React, { useState } from 'react';
import { usePlaylist } from '../contexts/PlaylistContext';
import { useNavigate } from 'react-router-dom';
import { RiPlayListFill, RiAddLine, RiMoreFill } from 'react-icons/ri';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

const Playlists = () => {
  const { playlists, createPlaylist, deletePlaylist, updatePlaylist } = usePlaylist();
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');
  const [editingPlaylistId, setEditingPlaylistId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);

  const handleCreatePlaylist = () => {
    if (!newPlaylistName.trim()) {
      toast.error('Please enter a playlist name');
      return;
    }
    createPlaylist(newPlaylistName.trim(), newPlaylistDescription.trim() || undefined);
    setNewPlaylistName('');
    setNewPlaylistDescription('');
    setIsCreating(false);
  };

  const handleEditSubmit = () => {
    if (!editName.trim() || !editingPlaylistId) return;
    updatePlaylist(
      editingPlaylistId,
      editName.trim(),
      editDescription.trim() || undefined
    );
    setEditingPlaylistId(null);
  };

  const startEditing = (playlistId: string) => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (playlist) {
      setEditName(playlist.name);
      setEditDescription(playlist.description || '');
      setEditingPlaylistId(playlistId);
    }
    setMenuOpenFor(null);
  };

  const toggleMenu = (playlistId: string) => {
    setMenuOpenFor(menuOpenFor === playlistId ? null : playlistId);
  };

  const closeAllMenus = () => {
    setMenuOpenFor(null);
  };

  return (
    <div className="h-[calc(100vh-136px)] overflow-y-auto px-6 py-6 custom-scrollbar" onClick={closeAllMenus}>
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end gap-6 mb-8">
        <div className="w-48 h-48 bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center rounded-lg shadow-xl">
          <RiPlayListFill className="text-white text-6xl" />
        </div>
        <div className="flex-1">
          <div className="text-sm uppercase tracking-wider text-zinc-400 font-semibold">Collection</div>
          <h1 className="text-5xl font-bold text-white mb-3">Your Playlists</h1>
          <div className="text-zinc-400 flex items-center gap-1">
            <span className="text-sm font-medium">{playlists.length} playlists</span>
          </div>
        </div>
      </div>

      {/* Create Playlist Button & Form */}
      <div className="mb-8">
        {isCreating ? (
          <div className="bg-zinc-800/70 p-6 rounded-xl shadow-lg mb-6 backdrop-blur-sm border border-zinc-700/50">
            <h3 className="text-xl font-bold text-white mb-4">Create New Playlist</h3>
            <div className="mb-4">
              <label className="block text-zinc-400 text-sm mb-1">Playlist Name</label>
              <input
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="My Awesome Playlist"
                className="w-full p-2.5 bg-zinc-900/90 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            <div className="mb-5">
              <label className="block text-zinc-400 text-sm mb-1">Description (optional)</label>
              <textarea
                value={newPlaylistDescription}
                onChange={(e) => setNewPlaylistDescription(e.target.value)}
                placeholder="Add an optional description"
                className="w-full p-2.5 bg-zinc-900/90 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 min-h-[100px]"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCreatePlaylist}
                className="px-5 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium"
              >
                Create
              </button>
              <button
                onClick={() => setIsCreating(false)}
                className="px-5 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-white font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full transition-colors duration-300 shadow-lg font-medium"
          >
            <RiAddLine size={20} />
            Create Playlist
          </button>
        )}
      </div>

      {/* Playlists Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {playlists.map((playlist) => (
          <div 
            key={playlist.id}
            className="bg-zinc-800/30 hover:bg-zinc-800/60 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden transition-all duration-300 group border border-zinc-700/30"
          >
            {editingPlaylistId === playlist.id ? (
              // Edit mode
              <div className="p-4">
                <div className="mb-3">
                  <label className="block text-zinc-400 text-xs mb-1">Playlist Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full p-2 bg-zinc-900/90 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-zinc-400 text-xs mb-1">Description</label>
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full p-2 bg-zinc-900/90 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50 min-h-[60px]"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={handleEditSubmit}
                    className="px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded text-white text-xs"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingPlaylistId(null)}
                    className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 rounded text-white text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // View mode
              <>
                <div className="relative cursor-pointer" onClick={() => navigate(`/playlist/${playlist.id}`)}>
                  <div className="aspect-square bg-zinc-900 overflow-hidden">
                    {playlist.imageUrl ? (
                      <img 
                        src={playlist.imageUrl} 
                        alt={playlist.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-500">
                        <RiPlayListFill size={80} className="text-white opacity-80" />
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                    <div className="p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold text-zinc-400">
                          {playlist.songs.length} {playlist.songs.length === 1 ? 'song' : 'songs'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 
                        className="font-medium text-white mb-1 cursor-pointer hover:text-blue-400 transition-colors" 
                        onClick={() => navigate(`/playlist/${playlist.id}`)}
                      >
                        {playlist.name}
                      </h3>
                      <div className="text-xs text-zinc-400">
                        Created {format(new Date(playlist.createdAt), 'MMM d, yyyy')}
                      </div>
                    </div>
                    <div className="relative">
                      <button 
                        className="text-zinc-400 hover:text-white p-1.5"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMenu(playlist.id);
                        }}
                      >
                        <RiMoreFill size={20} />
                      </button>
                      
                      {/* Dropdown Menu */}
                      {menuOpenFor === playlist.id && (
                        <div 
                          className="absolute top-full right-0 mt-1 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl py-2 w-36 z-10"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button 
                            className="w-full text-left px-4 py-2 text-sm text-white hover:bg-zinc-700"
                            onClick={() => startEditing(playlist.id)}
                          >
                            Edit details
                          </button>
                          <button 
                            className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-zinc-700"
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete "${playlist.name}"?`)) {
                                deletePlaylist(playlist.id);
                              }
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  {playlist.description && (
                    <p className="text-xs text-zinc-400 mt-2 line-clamp-2">
                      {playlist.description}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {playlists.length === 0 && !isCreating && (
        <div className="text-center py-16 bg-zinc-900/30 rounded-xl border border-zinc-800/50 backdrop-blur-sm mt-4">
          <RiPlayListFill size={64} className="mx-auto text-zinc-600 mb-4" />
          <h3 className="text-white text-xl font-medium mb-2">No playlists yet</h3>
          <p className="text-zinc-400 mb-6">Create your first playlist to organize your favorite songs</p>
          <button
            onClick={() => setIsCreating(true)}
            className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 rounded-full font-medium text-white transition-colors"
          >
            Create Playlist
          </button>
        </div>
      )}
    </div>
  );
};

export default Playlists; 