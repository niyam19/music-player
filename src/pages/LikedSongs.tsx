import { FaPause } from "react-icons/fa6";
import { useAudioContext } from "../contexts/AudioContext";
import { useLikedSongs } from "../contexts/LikedSongsContext";
import { FaPlay } from "react-icons/fa";
import { MdAccessTime } from "react-icons/md";

const LikedSongs = () => {
  const { likedSongs } = useLikedSongs();
  const {
    togglePlay,
    handleSongSelect,
    currentSong,
    isPlaying,
    songDurations,
  } = useAudioContext();

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-gray-400 text-sm border-b border-grey-700">
            <th className="py-2 px-4 w-10">#</th>
            <th className="py-2 px-4">Title</th>
            <th className="py-2 px-4 w-16 text-left"><MdAccessTime size={20}/></th>
          </tr>
        </thead>
        <tbody>
          {likedSongs.map((song, index) => {
            const handlePlay = () => {
              if (isSelected) {
                togglePlay();
              } else {
                handleSongSelect(song);
              }
            };
            const isSelected = currentSong?.songId === song?.songId;

            return (
              <tr
                key={song.songId}
                className="hover:bg-gray-900 transition duration-200 border-b border-gray-700"
              >
                <td className="py-3 px-4 text-gray-300">{index + 1}</td>
                <td className="py-3 px-4 flex items-center gap-3">
                  <div
                    className="relative w-10 h-10 rounded-md overflow-hidden group"
                    onClick={handlePlay}
                  >
                    <img
                      src={song.songImage}
                      alt={song.songName}
                      className={`w-full h-full object-cover transition duration-300 ease-in-out ${
                        isSelected
                          ? "brightness-50"
                          : "group-hover:brightness-50"
                      }`}
                    />

                    <button
                      className={`absolute inset-0 flex items-center justify-center text-white opacity-0 transition duration-300 transform
                    ${
                      isSelected
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-100 group-hover:opacity-100 group-hover:scale-125"
                    }`}
                    >
                      {isSelected && isPlaying ? (
                        <FaPause size={20} />
                      ) : (
                        <FaPlay size={14} />
                      )}
                    </button>
                  </div>
                  <div>
                    <p className="text-white font-semibold">{song.songName}</p>
                    {/* <p className="text-gray-400 text-xs">{song.songName}</p> */}
                  </div>
                </td>
                <td className="py-3 px-4 text-right text-gray-300">
                  {songDurations[song.songId]
                    ? new Date(songDurations[song.songId] * 1000)
                        .toISOString()
                        .substr(14, 5)
                    : "--:--"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LikedSongs;
