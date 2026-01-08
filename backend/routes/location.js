import express from "express";
import { clock } from "../controllers/attendance.js";
import checkToken from "../middlewares/checkToken.js";

const router = express.Router();

router.post("/clock", checkToken, clock);

export default router;
