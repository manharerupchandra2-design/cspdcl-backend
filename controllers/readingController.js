const db = require("../config/db");

// Add Reading
exports.addReading = async (req, res) => {
  try {

    const { bp_no, meter_id, reading_value } = req.body;

    // Get last reading
    const [lastReading] = await db.execute(
      "SELECT * FROM meter_readings WHERE bp_no = ? ORDER BY id DESC LIMIT 1",
      [bp_no]
    );

    const previousReading = lastReading.length > 0
      ? lastReading[0].reading_value
      : 0;

    const units = reading_value - previousReading;

    await db.execute(
      `INSERT INTO meter_readings 
      (bp_no, meter_id, reading_value, previous_reading, unit_consumed)
      VALUES (?, ?, ?, ?, ?)`,
      [bp_no, meter_id, reading_value, previousReading, units]
    );

    res.json({
      message: "Reading Added Successfully",
      previousReading,
      units
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get Readings by Consumer
exports.getReadingsByConsumer = async (req, res) => {
  try {

    const { consumerId } = req.params;

    const [rows] = await db.execute(
      "SELECT * FROM meter_readings WHERE consumer_id = ? ORDER BY id DESC",
      [consumerId]
    );

    res.json(rows);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


