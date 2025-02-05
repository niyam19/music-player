import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import { songs } from "./SongData";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.get("/api/songs", (req, res) => {
    res.json(songs);
})

const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running on ${PORT}`));