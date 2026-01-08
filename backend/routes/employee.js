import express from "express";
import {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
} from "../controllers/employee.js";

const router = express.Router();

router.post("/", createEmployee);
router.get("/", getAllEmployees);
router.get("/:id", getEmployeeById);

export default router;
