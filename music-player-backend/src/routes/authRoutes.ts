import express from "express";
import { signUp, login, loginGoogle } from "../controllers/authController";

const router = express.Router();

router.post("/signUp", signUp);
router.post("/login", login);
router.post("/login-google", loginGoogle);

export default router;