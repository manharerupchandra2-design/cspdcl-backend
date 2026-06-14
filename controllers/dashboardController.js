const db = require("../config/db");

exports.getDashboard = async (req, res) => {
  try {
    const readerId = req.user.id;  // ← token se

    // Reader ka zone nikalo
    const [readerRow] = await db.execute(
      'SELECT zone FROM meter_readers WHERE id = ?',
      [readerId]
    );

    const readerZone = readerRow[0].zone;

    // Zone wise consumers
    const [consumer] = await db.execute(
      "SELECT COUNT(*) total FROM consumers WHERE zone = ?",
      [readerZone]
    );

    // Zone wise readings
    const [reading] = await db.execute(
      `SELECT COUNT(*) total FROM meter_readings mr
       JOIN consumers c ON c.id = mr.consumer_id
       WHERE c.zone = ?`,
      [readerZone]
    );

    // Zone wise bills
    const [bill] = await db.execute(
      `SELECT COUNT(*) total FROM bills b
       JOIN meter_readings mr ON mr.id = b.reading_id
       JOIN consumers c ON c.id = mr.consumer_id
       WHERE c.zone = ?`,
      [readerZone]
    );

    res.status(200).json({
      success: true,
      data: {
        total_consumers: consumer[0].total,
        total_readings: reading[0].total,
        total_bills: bill[0].total
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};