import React, { useRef, useEffect } from 'react';
import { usePlaylist } from '../contexts/PlaylistContext';
import { useAudioContext } from '../contexts/AudioContext';
import { useLikedSongs } from '../contexts/LikedSongsContext';
import { RiPlayListAddLine, RiAddFill } from 'react-icons/ri';
import { IoHeartOutline, IoHeartSharp } from 'react-icons/io5';
import { BsThreeDots } from 'react-icons/bs';
import Song from '../interfaces/Song';

interface SongContextMenuProps {
  song: Song;
  position: { x: number; y: number } | null;
  onClose: () => void;
}

const SongContextMenu: React.FC<SongContextMenuProps> = ({ song, position, onClose }) => {
  const { playlists, addSongToPlaylist } = usePlaylist();
  const { handleSongSelect } = useAudioContext();
  const { toggleLikedSong, likedSongs } = useLikedSongs();
  const menuRef = useRef<HTMLDivElement>(null);
  
  const isLiked = likedSongs?.some(s => s?.songId === song?.songId);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Close menu when pressing Escape key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);

  if (!position) return null;

  // Adjust position to keep menu within viewport
  const adjustedPosition = {
    x: Math.min(position.x, window.innerWidth - 220),
    y: Math.min(position.y, window.innerHeight - 300)
  };

  return (
    <div 
      ref={menuRef}
      className="fixed z-50 w-64 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl py-2"
      style={{ 
        left: `${adjustedPosition.x}px`, 
        top: `${adjustedPosition.y}px` 
      }}
    >
      <div className="px-3 py-2 flex items-center gap-3 border-b border-zinc-700">
        <div className="w-10 h-10 rounded overflow-hidden bg-zinc-700 flex-shrink-0">
          <img src={song.songImage} alt={song.songName} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium truncate">{song.songName}</p>
          <p className="text-zinc-400 text-xs truncate">
            {song.songName.split(" ").slice(0, 2).join(" ")}
          </p>
        </div>
      </div>
      
      <div className="py-1">
        <button 
          className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700 flex items-center gap-2"
          onClick={() => {
            handleSongSelect(song);
            onClose();
          }}
        >
          <span className="w-5 flex justify-center">▶️</span>
          Play Now
        </button>
        
        <button 
          className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700 flex items-center gap-2"
          onClick={() => {
            toggleLikedSong(song);
            onClose();
          }}
        >
          <span className="w-5 flex justify-center">
            {isLiked ? <IoHeartSharp className="text-blue-500" /> : <IoHeartOutline />}
          </span>
          {isLiked ? 'Remove from Liked Songs' : 'Add to Liked Songs'}
        </button>
      </div>
      
      <div className="border-t border-zinc-700 py-1">
        <div className="px-4 py-2 text-xs text-zinc-400 font-medium">
          Add to playlist
        </div>
        
        <div className="max-h-48 overflow-y-auto custom-scrollbar">
          {playlists.length > 0 ? (
            playlists.map(playlist => (
              <button 
                key={playlist.id}
                className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700 flex items-center gap-2"
                onClick={() => {
                  addSongToPlaylist(playlist.id, song);
                  onClose();
                }}
              >
                <span className="w-5 flex justify-center">
                  <RiPlayListAddLine />
                </span>
                <span className="truncate">{playlist.name}</span>
              </button>
            ))
          ) : (
            <div className="px-4 py-2 text-xs text-zinc-500 italic">
              No playlists found
            </div>
          )}
        </div>
        
        <div className="border-t border-zinc-700 mt-1">
          <button 
            className="w-full text-left px-4 py-2 text-sm text-blue-400 hover:bg-zinc-700 flex items-center gap-2"
            onClick={() => {
              window.location.href = '/playlists';
              onClose();
            }}
          >
            <span className="w-5 flex justify-center">
              <RiAddFill />
            </span>
            Create New Playlist
          </button>
        </div>
      </div>
    </div>
  );
};

export const SongContextMenuButton: React.FC<{ song: Song }> = ({ song }) => {
  const [menuPosition, setMenuPosition] = React.useState<{ x: number; y: number } | null>(null);
  
  const handleOpenMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuPosition({ x: e.clientX, y: e.clientY });
  };
  
  return (
    <>
      <button 
        onClick={handleOpenMenu}
        className="text-zinc-400 hover:text-white p-1.5"
        title="More options"
      >
        <BsThreeDots size={16} />
      </button>
      
      {menuPosition && (
        <SongContextMenu 
          song={song} 
          position={menuPosition} 
          onClose={() => setMenuPosition(null)} 
        />
      )}
    </>
  );
};

export default SongContextMenu; 