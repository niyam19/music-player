import { useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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

  return (
    <div className="flex">
      <div
        className="bg-zinc-900 h-screen text-white p-4 flex-shrink-0"
        style={{ width: `${width}px`, transition: "width 0.1s ease-out" }}
      >
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Browse</h2>
          <ul className="space-y-2">
            <li>Coming Soon...</li>
          </ul>
        </div>

        <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Library</h2>
        <ul className="space-y-2">
          <li
            className={`cursor-pointer hover:text-zinc-400 transition duration-300 ${
              location.pathname === "/liked-songs" ? "text-blue-400" : ""
            }`}
            onClick={() => navigate("/liked-songs")}
          >
            Liked Songs
          </li>
        </ul>
        </div>
      </div>
      <div
        className="w-2 cursor-grab bg-zinc-600 hover:bg-zinc-400 transition duration-300"
        onMouseDown={handleMouseDown}
      ></div>
    </div>
  );
};

export default LeftPanel;
