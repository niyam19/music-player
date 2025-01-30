import Home from "../pages/Home";
import { Route, Routes } from "react-router-dom";
import LikedSongs from "../pages/LikedSongs";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/liked-songs" element={<LikedSongs />} />
    </Routes>
  );
};

export default AppRoutes;
