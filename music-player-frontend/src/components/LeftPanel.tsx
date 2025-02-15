import { useNavigate, useLocation } from "react-router-dom";

const LeftPanel = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get current route

  return (
    <div className="w-64 bg-zinc-900 h-screen text-white p-4 flex-shrink-0">
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Browse</h2>
        <ul className="space-y-2">
          <li>Coming Soon...</li>
        </ul>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Library</h2>
        <ul className="space-y-2">
          <li
            className={`cursor-pointer hover:text-zinc-400 ${
              location.pathname === "/liked-songs" ? "text-blue-400" : ""
            }`}
            onClick={() => navigate("/liked-songs")}
          >
            Liked Songs
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LeftPanel;
