import Home from "../pages/Home";
import { Route, Routes } from "react-router-dom";
import LikedSongs from "../pages/LikedSongs";
import ProfilePage from "../pages/profile";
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/liked-songs" element={<LikedSongs />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
};

export default AppRoutes;
