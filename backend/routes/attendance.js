import express from "express";
import { clock, getAttendanceStatus } from "../controllers/attendance.js";
import checkToken from "../middlewares/checkToken.js";

const router = express.Router();

router.post("/clock", checkToken, clock);
router.get("/status", checkToken, getAttendanceStatus);
export default router;
