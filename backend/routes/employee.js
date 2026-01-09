import express from "express";
import {
  createEmployee,
  deleteEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
} from "../controllers/employee.js";
import checkToken from "../middlewares/checkToken.js";

const router = express.Router();

router.post("/", createEmployee);
router.get("/", getAllEmployees);
router.get("/:id", getEmployeeById);
router.put("/:id", checkToken, updateEmployee);
router.delete("/:id", checkToken, deleteEmployee);

export default router;
