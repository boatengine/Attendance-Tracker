import express from "express";
import { getAttendanceReports } from "../controllers/report.js";

const router = express.Router();

// GET : /api/report
router.get("/", getAttendanceReports);

export default router;
