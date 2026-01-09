import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";

import authRoute from "./routes/auth.js";
import attendanceRoute from "./routes/attendance.js";
import employeeRoute from "./routes/employee.js";
import locationRoute from "./routes/location.js";
import reportRoute from "./routes/report.js";
import cors from "cors";
const app = express();

const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/api/auth", authRoute);
app.use("/api/attendance", attendanceRoute);
app.use("/api/employee", employeeRoute);
app.use("/api/location", locationRoute);
app.use("/api/report", reportRoute);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
