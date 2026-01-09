import pool from "../services/db.js";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    const { emp_id, pin } = req.body;

    if (!emp_id || !pin) {
      return res.status(400).json({ message: "emp_id and pin required" });
    }
    const [rows] = await pool.query(
      `SELECT id, employee_id, full_name, pin, is_active, is_admin,auth_location_id
       FROM employees
       WHERE employee_id = ?`,
      [emp_id]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "user not found" });
    }

    const employee = rows[0];

    if (!employee.is_active) {
      return res.status(403).json({ message: "account disable" });
    }

    if (employee.pin !== pin) {
      return res.status(401).json({ message: "pin incorrect" });
    }

    const token = jwt.sign(
      {
        id: employee.id,
        employee_id: employee.employee_id,
        full_name: employee.full_name,
        auth_location_id: employee.auth_location_id,
        is_admin: employee.is_admin,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 8 * 60 * 60 * 1000, // 8 horu
    });

    return res.status(200).json({
      success: true,
      message: "login success",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "server error" });
  }
};

export const logout = (req, res) => {
  try {
    //clear cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: false, // production
      sameSite: "None",
    });
    return res.status(200).json({
      success: true,
      message: "logout success",
    });
  } catch (err) {
    return res.status(500).json({
      message: "server error",
    });
  }
};

export const me = (req, res) => {
  try {
    //clear cookie

    return res.status(200).json(req.user);
  } catch (err) {
    return res.status(500).json({
      message: "server error",
    });
  }
};
