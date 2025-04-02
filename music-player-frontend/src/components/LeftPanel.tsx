import { useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoHomeOutline, IoHome } from "react-icons/io5";
import { MdOutlineLibraryMusic, MdLibraryMusic } from "react-icons/md";
import { RiPlayListFill, RiPlayListLine } from "react-icons/ri";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { IoMdResize } from "react-icons/io";

const LeftPanel = () => {
  const [width, setWidth] = useState(250);
  const isResizing = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing.current) return;
    let newWidth = e.clientX;

    if (newWidth < 200) newWidth = 200;
    if (newWidth > 400) newWidth = 400;

    setWidth(newWidth);
  };

  const handleMouseUp = () => {
    isResizing.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleMouseDown = () => {
    isResizing.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex h-full">
      <div
        className="bg-zinc-900/90 text-white flex-shrink-0 flex flex-col h-full overflow-hidden border-r border-zinc-800/50"
        style={{ width: `${width}px`, transition: isResizing.current ? "none" : "width 0.2s ease-out" }}
      >
        <div className="p-5 flex-1 overflow-y-auto custom-scrollbar">
          <div className="mb-8">
            <h2 className="text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-4 pl-2">Menu</h2>
            <ul className="space-y-2">
              <li>
                <NavItem 
                  to="/" 
                  label="Home" 
                  isActive={isActive("/")}
                  icon={isActive("/") ? <IoHome size={20} /> : <IoHomeOutline size={20} />}
                />
              </li>
              <li>
                <NavItem 
                  to="/library" 
                  label="Library" 
                  isActive={isActive("/library")}
                  icon={isActive("/library") ? <MdLibraryMusic size={20} /> : <MdOutlineLibraryMusic size={20} />}
                />
              </li>
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-4 pl-2">Your Collection</h2>
            <ul className="space-y-2">
              <li>
                <NavItem 
                  to="/liked-songs" 
                  label="Liked Songs" 
                  isActive={isActive("/liked-songs")}
                  icon={isActive("/liked-songs") ? <FaHeart size={18} className="text-blue-400" /> : <FaRegHeart size={18} />}
                />
              </li>
              <li>
                <NavItem 
                  to="/playlists" 
                  label="Playlists" 
                  isActive={isActive("/playlists")}
                  icon={isActive("/playlists") ? <RiPlayListFill size={20} /> : <RiPlayListLine size={20} />}
                />
              </li>
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-4 pl-2">Playlists</h2>
            <div className="pl-2 text-zinc-400 text-sm">
              <div className="p-2 hover:bg-zinc-800/60 rounded-md transition-colors duration-200 cursor-pointer">
                Create New Playlist
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-zinc-800/50 text-center">
          <div className="text-xs text-zinc-500">Harmony Music v1.0</div>
        </div>
      </div>
      
      <div
        className="flex items-center justify-center w-1 cursor-col-resize bg-gradient-to-r from-zinc-800/0 to-zinc-800/50 hover:to-zinc-700 group transition-colors duration-300"
        onMouseDown={handleMouseDown}
      >
        <div className="w-1 h-8 bg-zinc-600 group-hover:bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <IoMdResize size={8} className="text-white" />
        </div>
      </div>
    </div>
  );
};

interface NavItemProps {
  to: string;
  label: string;
  isActive: boolean;
  icon: React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({ to, label, isActive, icon }) => {
  const navigate = useNavigate();
  
  return (
    <button 
      onClick={() => navigate(to)}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
        isActive 
          ? "bg-blue-500/10 text-blue-400" 
          : "text-zinc-300 hover:bg-zinc-800/50 hover:text-white"
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  );
};

export default LeftPanel;
