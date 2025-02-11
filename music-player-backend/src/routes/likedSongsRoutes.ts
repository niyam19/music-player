import express from "express";
import LikedSong from "../models/LikedSong";
import User from "../models/User";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    const likedSongs = await LikedSong.findOne({ userId: userId });

    if (!likedSongs) {
      res.status(404).json({ message: "No liked songs found" });
      return;
    }

    res.json(likedSongs.songs);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  const { songId, songName, songUrl, songImage } = req.body;

  try {
    const userId = (req as any).user.userId;

    if (!songId || !songName || !songImage || !songUrl) {
      res.status(400).json({ message: "All song details are required" });
    }

    let likedSongs = await LikedSong.findOne({ userId: userId });

    if (!likedSongs) {
      likedSongs = new LikedSong({
        userId: userId,
        songs: [{ songId, songName, songUrl, songImage }],
      });
    } else {
      const songExists = likedSongs.songs.some(
        (song) => song.songId === songId
      );
      if (songExists) {
        res.status(400).json({ message: "Song is already in liked songs" });
        return;
      }
      likedSongs.songs.push({ songId, songName, songUrl, songImage });
    }

    await likedSongs.save();
    res.status(201).json({ message: "Song added to liked songs" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.delete("/", authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).user.userId;
    let { songId } = req.body;
    songId = Number(songId);

    if (!songId) {
      res.status(400).json({ message: "songId is required" });
      return;
    }

    let likedSongs = await LikedSong.findOne({ userId });
    if (!likedSongs) {
      res.status(404).json({ message: "No liked songs found" });
      return;
    }

    const initialLength = likedSongs.songs.length;
    
    likedSongs.set("songs", likedSongs.songs.filter((song) => song.songId !== songId));

    if (likedSongs.songs.length === initialLength) {
      res.status(404).json({ message: "Song not found in liked songs" });
      return;
    }

    if (likedSongs.songs.length === 0) {
      await LikedSong.deleteOne({ userId });
      res.status(200).json({ message: "All liked songs removed" });
      return;
    }

    await likedSongs.save();
    res.status(200).json({ message: "Song removed from liked songs" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

export default router;
