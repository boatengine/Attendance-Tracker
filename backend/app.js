import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.js";
import attendanceRoute from "./routes/attendance.js";
import employeeRoute from "./routes/employee.js";
const app = express();

const PORT = process.env.PORT || 3001;
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoute);
app.use("/api/attendance", attendanceRoute);
app.use("/api/employee", employeeRoute);
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
