const db = require("../config/db");
const upload = require('../middleware/upload');



exports.setReading = async (req, res) => {
  try {
    console.log('BODY type:', typeof req.body);
    console.log('BODY keys:', Object.keys(req.body || {}));
    console.log('FILE type:', typeof req.file);
    console.log('Content-Type:', req.headers['content-type']);
    console.log('BODY:', req.body);
    console.log('FILE:', req.file);
    const { consumerId } = req.params;

    const {
      meter_id,
      reader_id,
      meter_type,
      current_reading,

    } = req.body;
    const meter_photo = req.file
      ? req.file.path
      : null;
    if (
      !meter_id ||
      !reader_id ||
      current_reading == null
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const [previousBill] = await db.query(
      `SELECT current_reading
       FROM meter_readings
       WHERE consumer_id = ?
       ORDER BY id DESC
       LIMIT 1`,
      [consumerId]
    );

    const previousReading =
      previousBill.length > 0
        ? previousBill[0].current_reading
        : 0;

    const unitsConsumed =
      current_reading - previousReading;

    const sql1 = "select max(max_units) from tariffs where category=?";
    const [rows] = await db.query(sql1, [meter_type])
    const maxUnits = rows[0]?.max_units??0;
    if (current_reading > maxUnits) {
      return res.status(400).json({
        success: false,
        message: "Not possible"
      })
    }
    if (unitsConsumed < 0) {
      return res.status(400).json({
        success: false,
        message:
          "Current reading cannot be less than previous reading",
      });
    }

    const [result] = await db.query(
      `INSERT INTO meter_readings
      (
        consumer_id,
        meter_id,
        reader_id,
        previous_reading,
        current_reading,
        units,
        meter_photo
      
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        consumerId,
        meter_id,
        reader_id,
        previousReading,
        current_reading,
        unitsConsumed,
        meter_photo
      ]
    );

    return res.status(200).json({
      success: true,
      message:
        "Reading submitted successfully",
      reading_id: result.insertId,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getReadingHistory = async (req, res) => {
  try {
    const readerId = req.user.id;

    const [readerRow] = await db.execute(
      'SELECT zone FROM meter_readers WHERE id = ?',
      [readerId]
    );
    const readerZone = readerRow[0].zone;

    const [rows] = await db.query(`
      SELECT
        mr.id,
        mr.current_reading,
        mr.reading_date AS created_at,
        mr.meter_photo,
        c.id AS consumer_id,
        c.name AS consumer_name,
        c.consumer_no,
        m.id AS meter_id,
        m.meter_no
      FROM meter_readings mr
      JOIN consumers c ON c.id = mr.consumer_id
      JOIN meters m ON m.id = mr.meter_id
      WHERE c.zone = ?
      ORDER BY mr.reading_date DESC
    `, [readerZone]);

    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
