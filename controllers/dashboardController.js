const db = require("../config/db");
exports.getDashboard = async (req, res) => {
  try {
    const readerId = req.user.id;

    const [readerRow] = await db.execute(
      'SELECT zone FROM meter_readers WHERE id = ?',
      [readerId]
    );
    const readerZone = readerRow[0].zone;

    // Total consumers in zone
    const [consumer] = await db.execute(
      "SELECT COUNT(*) total FROM consumers WHERE zone = ?",
      [readerZone]
    );

    // Total readings in zone
    const [reading] = await db.execute(
      `SELECT COUNT(*) total FROM meter_readings mr
       JOIN consumers c ON c.id = mr.consumer_id
       WHERE c.zone = ?`,
      [readerZone]
    );

    // Total bills in zone
    const [bill] = await db.execute(
      `SELECT COUNT(*) total FROM bills b
       JOIN meter_readings mr ON mr.id = b.reading_id
       JOIN consumers c ON c.id = mr.consumer_id
       WHERE c.zone = ?`,
      [readerZone]
    );

    // Aaj ki readings
    const [todayReading] = await db.execute(
      `SELECT COUNT(*) total FROM meter_readings mr
       JOIN consumers c ON c.id = mr.consumer_id
       WHERE c.zone = ? AND DATE(mr.reading_date) = CURDATE()`,
      [readerZone]
    );

    // Aaj ke bills
    const [todayBill] = await db.execute(
      `SELECT COUNT(*) total FROM bills b
       JOIN meter_readings mr ON mr.id = b.reading_id
       JOIN consumers c ON c.id = mr.consumer_id
       WHERE c.zone = ? AND DATE(mr.reading_date) = CURDATE()`,
      [readerZone]
    );

    // Pending consumers — jinki reading nahi hui
    const [pending] = await db.execute(
      `SELECT COUNT(*) total FROM consumers c
       WHERE c.zone = ?
       AND c.id NOT IN (
         SELECT DISTINCT mr.consumer_id 
         FROM meter_readings mr
         WHERE DATE(mr.reading_date) = CURDATE()
       )`,
      [readerZone]
    );

    // Recent 5 readings
    const [recentReadings] = await db.execute(
      `SELECT
        mr.id,
        mr.current_reading,
        mr.reading_date,
        c.name AS consumer_name,
        c.consumer_no
       FROM meter_readings mr
       JOIN consumers c ON c.id = mr.consumer_id
       WHERE c.zone = ?
       ORDER BY mr.reading_date DESC
       LIMIT 5`,
      [readerZone]
    );

    res.status(200).json({
      success: true,
      data: {
        total_consumers: consumer[0].total,
        total_readings: reading[0].total,
        total_bills: bill[0].total,
        today_readings: todayReading[0].total,
        today_bills: todayBill[0].total,
        pending_today: pending[0].total,
        recent_readings: recentReadings,
      }
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
// exports.getDashboard = async (req, res) => {
//   try {
//     const readerId = req.user.id;  // ← token se

//     // Reader ka zone nikalo
//     const [readerRow] = await db.execute(
//       'SELECT zone FROM meter_readers WHERE id = ?',
//       [readerId]
//     );

//     const readerZone = readerRow[0].zone;

//     // Zone wise consumers
//     const [consumer] = await db.execute(
//       "SELECT COUNT(*) total FROM consumers WHERE zone = ?",
//       [readerZone]
//     );

//     // Zone wise readings
//     const [reading] = await db.execute(
//       `SELECT COUNT(*) total FROM meter_readings mr
//        JOIN consumers c ON c.id = mr.consumer_id
//        WHERE c.zone = ?`,
//       [readerZone]
//     );

//     // Zone wise bills
//     const [bill] = await db.execute(
//       `SELECT COUNT(*) total FROM bills b
//        JOIN meter_readings mr ON mr.id = b.reading_id
//        JOIN consumers c ON c.id = mr.consumer_id
//        WHERE c.zone = ?`,
//       [readerZone]
//     );

//     res.status(200).json({
//       success: true,
//       data: {
//         total_consumers: consumer[0].total,
//         total_readings: reading[0].total,
//         total_bills: bill[0].total
//       }
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// };