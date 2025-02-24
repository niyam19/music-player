import mongoose from "mongoose";

interface IUser extends mongoose.Document {
    username: string;
    email: string;
    password: string;
    profilePic?: string;
    currentSong?: mongoose.Schema.Types.ObjectId;
    currentTime?: number;
}

const userSchema = new mongoose.Schema<IUser>({
    username: { type: String, required: true},
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    profilePic: { type: String},
    currentSong: { type: mongoose.Schema.Types.ObjectId, ref: "Song", default: null },
    currentTime: { type: Boolean, default: 0},
})

const User = mongoose.model<IUser>("User", userSchema);

export default User;