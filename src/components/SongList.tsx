import React from "react";
import SongCard from "./SongCard";
import Song from "../types/Song";

const SongList: React.FC<{
  songs: Song[];
}> = ({ songs}) => {
  
  return (
    <div className="flex flex-wrap justify-center gap-4 p-4">
      {songs.map((song, index) => (
        <div
          key={index}
          
          className="cursor-pointer"
        >
          <SongCard selectedSong={song}/>
        </div>
      ))}
    </div>
  );
};

export default SongList;
