import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import User from "../models/User";

const router = express.Router();

router.put("/update-profile", authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const { username, profilePic } = req.body;

    if (!username && !profilePic) {
      res.status(400).json({ message: "No updates provided" });
      return;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { username, profilePic } },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    res
      .status(200)
      .json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/update-song", async (req, res) => {
  const { userId, songId, currentTime } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        currentSongId: songId,
        currentTime: currentTime,
      },
      { new: true }
    );
    res.json({ message: "Song state updated", user });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.get("/current-song/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).populate("currentSongId");

    if(!user || !user.currentSongId){
      res.json({message: "No song found", currentSongId: null});
      return;
    }

    res.json({currentSongId: user.currentSongId, currentTime: user.currentTime});
  } catch (error) {
    res.status(500).json({ error: error});
  }
});
export default router;
