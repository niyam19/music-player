import React, { createContext, useContext, useState, useEffect } from 'react';
import Playlist from '../interfaces/Playlist';
import Song from '../interfaces/Song';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';

interface PlaylistContextType {
  playlists: Playlist[];
  createPlaylist: (name: string, description?: string) => Playlist;
  deletePlaylist: (id: string) => void;
  updatePlaylist: (id: string, name: string, description?: string) => void;
  addSongToPlaylist: (playlistId: string, song: Song) => void;
  removeSongFromPlaylist: (playlistId: string, songId: number) => void;
  getPlaylist: (id: string) => Playlist | undefined;
  setActivePlaylist: (playlist: Playlist | null) => void;
  activePlaylist: Playlist | null;
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

export const PlaylistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    const savedPlaylists = localStorage.getItem('playlists');
    if (savedPlaylists) {
      try {
        // Parse dates correctly
        const parsed = JSON.parse(savedPlaylists, (key, value) => {
          if (key === 'createdAt' || key === 'updatedAt') {
            return new Date(value);
          }
          return value;
        });
        return parsed;
      } catch (error) {
        console.error('Error parsing playlists from localStorage', error);
        return [];
      }
    }
    return [];
  });

  const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(null);

  // Save playlists to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('playlists', JSON.stringify(playlists));
  }, [playlists]);

  const createPlaylist = (name: string, description?: string): Playlist => {
    const now = new Date();
    const newPlaylist: Playlist = {
      id: uuidv4(),
      name,
      description,
      createdAt: now,
      updatedAt: now,
      songs: [],
      imageUrl: 'https://placehold.co/400x400/3b82f6/FFFFFF?text=New+Playlist',
    };

    setPlaylists([...playlists, newPlaylist]);
    toast.success(`Playlist "${name}" created successfully`);
    return newPlaylist;
  };

  const deletePlaylist = (id: string) => {
    setPlaylists(playlists.filter(playlist => playlist.id !== id));
    
    if (activePlaylist?.id === id) {
      setActivePlaylist(null);
    }
    
    toast.success('Playlist deleted successfully');
  };

  const updatePlaylist = (id: string, name: string, description?: string) => {
    setPlaylists(playlists.map(playlist => {
      if (playlist.id === id) {
        return {
          ...playlist,
          name,
          description,
          updatedAt: new Date()
        };
      }
      return playlist;
    }));
    toast.success(`Playlist "${name}" updated successfully`);
  };

  const addSongToPlaylist = (playlistId: string, song: Song) => {
    setPlaylists(playlists.map(playlist => {
      if (playlist.id === playlistId) {
        // Check if song already exists in playlist
        if (playlist.songs.some(s => s.songId === song.songId)) {
          toast.info(`"${song.songName}" is already in this playlist`);
          return playlist;
        }
        
        // Update the playlist's image with the first song's image if no custom image
        const updatedPlaylist = {
          ...playlist,
          songs: [...playlist.songs, song],
          updatedAt: new Date()
        };
        
        // If this is the first song, use its image as the playlist cover
        if (playlist.songs.length === 0 && !playlist.imageUrl?.includes('text=New+Playlist')) {
          updatedPlaylist.imageUrl = song.songImage;
        }
        
        toast.success(`"${song.songName}" added to "${playlist.name}"`);
        return updatedPlaylist;
      }
      return playlist;
    }));
  };

  const removeSongFromPlaylist = (playlistId: string, songId: number) => {
    setPlaylists(playlists.map(playlist => {
      if (playlist.id === playlistId) {
        return {
          ...playlist,
          songs: playlist.songs.filter(song => song.songId !== songId),
          updatedAt: new Date()
        };
      }
      return playlist;
    }));
    toast.success('Song removed from playlist');
  };

  const getPlaylist = (id: string) => {
    return playlists.find(playlist => playlist.id === id);
  };

  const value = {
    playlists,
    createPlaylist,
    deletePlaylist,
    updatePlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist,
    getPlaylist,
    activePlaylist,
    setActivePlaylist
  };

  return (
    <PlaylistContext.Provider value={value}>
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylist = () => {
  const context = useContext(PlaylistContext);
  if (context === undefined) {
    throw new Error('usePlaylist must be used within a PlaylistProvider');
  }
  return context;
}; 