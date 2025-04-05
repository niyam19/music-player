import Home from "../pages/Home";
import { Route, Routes } from "react-router-dom";
import LikedSongs from "../pages/LikedSongs";
import ProfilePage from "../pages/profile";
import Library from "../pages/Library";
import Playlists from "../pages/Playlists";
import PlaylistDetail from "../pages/PlaylistDetail";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/liked-songs" element={<LikedSongs />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/library" element={<Library />} />
      <Route path="/playlists" element={<Playlists />} />
      <Route path="/playlist/:id" element={<PlaylistDetail />} />
    </Routes>
  );
};

export default AppRoutes;
