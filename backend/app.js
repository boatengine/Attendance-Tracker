import express from "express";
import "dotenv/config";
import authRoute from "./routes/auth.js";
const app = express();

const PORT = process.env.PORT || 3001;
app.use(express.json());
app.use("/api/auth", authRoute);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
