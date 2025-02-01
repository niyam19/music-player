import { useNavigate } from "react-router-dom";
import Icon from "../assets/icons/music-player.png";
import Profile from "../assets/icons/profile-icon.png";

const Header = () => {

  const navigate = useNavigate();

  return (
    <header className="w-full bg-gray-900 text-white flex items-center justify-between px-6 py-4 shadow-md">
      <div className="flex items-center">
        <img src={Icon} alt="Music Player Logo" className="w-8 h-8 cursor-pointer" onClick={() => navigate("/")} />
        <h1 className="ml-2 text-xl font-bold">Music Player</h1>
      </div>
      <div className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-lg min-w-48 mx-4">
        <input
          type="text"
          placeholder="Search"
          className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 "
        />
      </div>
      <div>
        <img
          src={Profile}
          alt="Profile Logo"
          className="w-8 h-8 rounded-full"
        />
      </div>
    </header>
  );
};

export default Header;
