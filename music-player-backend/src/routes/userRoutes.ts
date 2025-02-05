import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import User from "../models/User";

const router = express.Router();

router.get("/profile", authMiddleware, async(req, res) => {
    try {
        const user = await User.findById((req as any).user.userId).select("-password");
        if(!user){
            res.status(404).json({message: "User not found"});
            return;
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({message: "Internal server error"});
    }
});

export default router;