import pool from "../services/db.js";

export const createLocation = async (req, res) => {
  try {
    const { name, latitude, longitude, radius_meters } = req.body;

    if (!name || latitude == null || longitude == null || !radius_meters) {
      return res.status(400).json({ message: "missing data" });
    }

    const [result] = await pool.query(
      `INSERT INTO authorized_locations
       (name, latitude, longitude, radius_meters, is_active)
       VALUES (?, ?, ?, ?, true)`,
      [name, latitude, longitude, radius_meters]
    );

    const [rows] = await pool.query(
      `SELECT * FROM authorized_locations WHERE id = ?`,
      [result.insertId]
    );

    res.json({ success: true, message: rows[0] });
  } catch (err) {
    console.error("Create location error:", err);
    res.status(500).json({ message: "server error" });
  }
};

export const editLocation = async (req, res) => {
  try {
    const { id, name, latitude, longitude, radius_meters } = req.body;

    if (!id) {
      return res.status(400).json({ message: "missing location id" });
    }

    await pool.query(
      `UPDATE authorized_locations
        SET name = ?, latitude = ?, longitude = ?, radius_meters = ?
        WHERE id = ?`,
      [name, latitude, longitude, radius_meters, id]
    );

    res.json({ success: true, message: "ok" });
  } catch (err) {
    console.error("Update location error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getLocationById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "missing id" });
    }

    const [rows] = await pool.query(
      `SELECT * FROM authorized_locations WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "location not found" });
    }

    res.json({
      success: true,
      location: rows[0],
    });
  } catch (err) {
    console.error("Get location error:", err);
    res.status(500).json({ error: "server error" });
  }
};

export const getAllLocations = async (req, res) => {
  try {
    let sql = "SELECT * FROM authorized_locations";

    const [rows] = await pool.query(sql);

    res.json({
      success: true,
      count: rows.length,
      locations: rows,
    });
  } catch (err) {
    console.error("Get all locations error:", err);
    res.status(500).json({ error: "server error" });
  }
};

export const deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;

    const [exist] = await pool.query(
      "SELECT id FROM authorized_locations WHERE id = ?",
      [id]
    );

    if (exist.length === 0) {
      return res.status(404).json({ error: "Locations not found" });
    }

    await pool.query("DELETE FROM authorized_locations WHERE id = ?", [id]);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "server error" });
  }
};
