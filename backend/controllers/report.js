import pool from "../services/db.js";

export const getAttendanceReports = async (req, res) => {
  try {
    const { employee_id, start_date, end_date, session_type } = req.query;

    let sql = `
      SELECT 
        ar.*,
        e.full_name,
        e.employee_id AS emp_code,
        e.department
      FROM attendance_records ar
      JOIN employees e ON ar.employee_id = e.id
      WHERE 1 = 1
    `;

    const params = [];

    if (employee_id) {
      sql += ` AND e.employee_id = ?`;
      params.push(employee_id);
    }

    if (start_date) {
      sql += ` AND ar.date >= ?`;
      params.push(start_date);
    }

    if (end_date) {
      sql += ` AND ar.date <= ?`;
      params.push(end_date);
    }

    if (session_type) {
      sql += ` AND ar.session_type = ?`;
      params.push(session_type);
    }

    sql += ` ORDER BY ar.date DESC, ar.created_at DESC`;

    const [records] = await pool.query(sql, params);

    // varible
    let totalMinutes = 0;
    let verifiedRecords = 0;
    let missedClockOuts = 0;

    // summary
    records.forEach((r) => {
      if (r.clock_in && r.clock_out) {
        totalMinutes +=
          (new Date(r.clock_out) - new Date(r.clock_in)) / (1000 * 60);
      }

      if (r.clock_in_verified && r.clock_out_verified) {
        verifiedRecords++;
      }

      if (r.clock_in && !r.clock_out) {
        missedClockOuts++;
      }
    });

    // res

    res.json({
      records,
      summary: {
        totalRecords: records.length,
        totalHours: totalMinutes / 60,
        verifiedRecords,
        missedClockOuts,
      },
    });
  } catch (err) {
    console.error("Reports error:", err);
    res.status(500).json({ error: "server error" });
  }
};
