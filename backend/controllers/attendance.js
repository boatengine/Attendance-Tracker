import pool from "../services/db.js";
import jwt from "jsonwebtoken";

export const clock = async (req, res) => {
  try {
    const { auth_location_id, session_type, action, face_data, location } =
      req.body;
    const { id } = req.user;

    if (!auth_location_id || !session_type || !action || !location) {
      return res.status(400).json({ message: "missing data" });
    }

    const today = new Date().toISOString().split("T")[0];

    const [rows] = await pool.query(
      `SELECT * FROM attendance_records 
       WHERE employee_id = ? AND session_type = ? AND date = ?`,
      [id, session_type, today]
    );

    // clock in
    if (action === "clock_in") {
      if (rows.length > 0 && rows[0].clock_in) {
        return res.status(400).json({ message: "already clocked_in" });
      }

      await pool.query(
        `INSERT INTO attendance_records
        ( auth_location_id, employee_id, session_type, date, clock_in, clock_in_location, face_in )
        VALUES (?, ?, ?, ?, NOW(), ?, ?)`,
        [auth_location_id, id, session_type, today, location, face_data]
      );

      return res.json({ message: "clock in success" });
    }

    // clock out and check ว่ามีclockinไหม
    if (action === "clock_out") {
      if (rows.length === 0 || !rows[0].clock_in) {
        return res.status(400).json({ message: "not clocked in yet" });
      }

      if (rows[0].clock_out) {
        return res.status(400).json({ message: "already clocked out" });
      }

      await pool.query(
        `UPDATE attendance_records
         SET clock_out = NOW(),
             clock_out_location = ?,
             face_out = ?
         WHERE id = ?`,
        [location, face_data, rows[0].id]
      );

      return res.json({ message: "clock out success" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "server error" });
  }
};
