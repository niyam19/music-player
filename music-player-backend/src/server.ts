import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import likedSongsRoutes from "./routes/likedSongsRoutes"
import { songs } from "./SongData";
import { authMiddleware } from "./middleware/authMiddleware";

dotenv.config();
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

const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on ${PORT}`));