import Song from "./Song";

interface AudioContextType {
    songs: Song[];
    audioRef: React.RefObject<HTMLAudioElement>;
    currentSong: Song;
    setCurrentSong: (song: Song) => void;
    isPlaying: boolean;
    togglePlay: () => void;
    playSong: () => void;
    pauseSong: () => void;
    handleProgress: () => void;
    progress: number;
    setProgress: (progress: number) => void;
    handlePrev: () => void;
    handleNext: () => void;
    handleSongSelect: (song: Song, fromLikedSongs?: boolean) => void;
    songDurations: Record<number, number>;
    toggleShuffle: () => void;
}

export default AudioContextType;