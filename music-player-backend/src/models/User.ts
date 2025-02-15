import mongoose from "mongoose";

interface IUser extends mongoose.Document {
    username: string;
    email: string;
    password: string;
    profilePic?: string;
}

const userSchema = new mongoose.Schema<IUser>({
    username: { type: String, required: true},
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    profilePic: { type: String}
})

const User = mongoose.model<IUser>("User", userSchema);

export default User;