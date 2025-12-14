import express from "express";
import cors from "cors";
import connectDB from "../config/db";
import authRoutes from "../routes/authRoutes";
import userRoutes from "../routes/userRoutes";
import likedSongsRoutes from "../routes/likedSongsRoutes"
import { songs } from "../SongData";
import { authMiddleware } from "../middleware/authMiddleware";

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/liked-songs", likedSongsRoutes)

app.get("/api/songs", authMiddleware, (req, res) => {
    res.json(songs);
})

app.get("/", (req, res) => {
  res.send("Music Player Backend is running 🚀");
});

export default app;