import mongoose from "mongoose";

const likedSongsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  songs: [{
    songId: {type: Number, required: true},
    songName: {type: String, required: true},
    songUrl: {type: String, required: true},
    songImage: {type: String, required: true},
  }],
});

const LikedSong = mongoose.model("Liked Song", likedSongsSchema);

export default LikedSong;