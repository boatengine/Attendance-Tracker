import express from "express";

import checkToken from "../middlewares/checkToken.js";
import {
  createLocation,
  deleteLocation,
  editLocation,
  getAllLocations,
  getLocationById,
} from "../controllers/location.js";

const router = express.Router();
router.get("/", checkToken, getAllLocations);
router.get("/:id", getLocationById);
router.post("/", checkToken, createLocation);
router.put("/", checkToken, editLocation);
router.delete("/:id", checkToken, deleteLocation);
export default router;
