import { useNavigate } from "react-router-dom";
import Icon from "../assets/icons/music-player.png";
import Profile from "../assets/icons/profile-icon.png";

const Header = () => {

  const userData = localStorage.getItem('userData');
  const user = userData ? JSON.parse(userData) : null;
  const navigate = useNavigate();

  return (
    <header className="w-full bg-black text-white flex items-center justify-between px-6 py-4 shadow-md">
      <div className="flex items-center">
        <img src={Icon} alt="Music Player Logo" className="w-8 h-8 cursor-pointer" onClick={() => navigate("/")} />
        <h1 className="ml-2 text-xl font-bold">Music Player</h1>
      </div>
      <div className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-lg min-w-48 mx-4">
        <input
          type="text"
          placeholder="Search"
          className="w-full bg-zinc-900 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 "
        />
      </div>
      <div className="flex items-center">
        <img
          title={user?.username}
          onClick={() => navigate("/profile")}
          src={Profile}
          alt="Profile Logo"
          className="w-8 h-8 rounded-full cursor-pointer hover:scale-110 transition-transform duration-300"
        />
      </div>
    </header>
  );
};

export default Header;
