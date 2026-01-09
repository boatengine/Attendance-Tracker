import express from "express";
import { login, logout, me } from "../controllers/auth.js";
import checkToken from "../middlewares/checkToken.js";

const router = express.Router();

router.post("/login", login);

router.post("/logout", logout);
router.get("/me", checkToken, me);
export default router;
