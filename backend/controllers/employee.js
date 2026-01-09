import pool from "../services/db.js";

export const createEmployee = async (req, res) => {
  try {
    const { employee_id, pin, full_name, email, department, position } =
      req.body;

    if (!employee_id || !pin || !full_name) {
      return res.status(400).json({
        error: "Employee ID, PIN, and full name are required",
      });
    }

    if (pin.length !== 6) {
      return res.status(400).json({ error: "PIN must be 6 digits" });
    }

    // check dupli employee_id
    const [existing] = await pool.query(
      "SELECT id FROM employees WHERE employee_id = ?",
      [employee_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: "Employee ID already exists" });
    }

    // insert
    const [result] = await pool.query(
      `INSERT INTO employees
       (employee_id, pin, full_name, email, department, position)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        employee_id,
        pin,
        full_name,
        email || null,
        department || null,
        position || null,
      ]
    );

    const [rows] = await pool.query("SELECT * FROM employees WHERE id = ?", [
      result.insertId,
    ]);

    res.json({ success: true, employee: rows[0] });
  } catch (err) {
    // console.error("Create employee error:", err);
    res.status(500).json({ message: "server error" });
  }
};

export const getAllEmployees = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, employee_id, full_name, email, department, position, created_at
       FROM employees
       ORDER BY created_at DESC`
    );

    res.json({ success: true, employees: rows });
  } catch (err) {
    // console.error("Get all employees error:", err);
    res.status(500).json({ message: "server error" });
  }
};

export const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `SELECT id, employee_id, full_name, email, department, position,auth_location_id, created_at
       FROM employees
       WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json({ success: true, employee: rows[0] });
  } catch (err) {
    // console.error("Get employee by id error:", err);
    res.status(500).json({ message: "server error" });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, email, department, position, auth_location_id } =
      req.body;

    // check exist
    const [exist] = await pool.query("SELECT id FROM employees WHERE id = ?", [
      id,
    ]);

    if (exist.length === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    await pool.query(
      `UPDATE employees
       SET full_name = ?,
           email = ?,
           department = ?,
           position = ?
           auth_location_id = ?
       WHERE id = ?`,
      [
        full_name || null,
        email || null,
        department || null,
        position || null,
        auth_location_id || null,
        id,
      ]
    );

    const [rows] = await pool.query(
      `SELECT id, employee_id, full_name, email, department, position, auth_location_id, created_at
       FROM employees WHERE id = ?`,
      [id]
    );

    res.json({ success: true, employee: rows[0] });
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const [exist] = await pool.query("SELECT id FROM employees WHERE id = ?", [
      id,
    ]);

    if (exist.length === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    await pool.query("DELETE FROM employees WHERE id = ?", [id]);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
};
