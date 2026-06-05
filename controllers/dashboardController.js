const db = require("../config/db");

exports.getDashboard = async (req, res) => {
  try {

    const [consumer] =
        await db.execute("SELECT COUNT(*) total FROM consumers");

    const [reading] =
        await db.execute("SELECT COUNT(*) total FROM meter_readings");

    const [bill] =
        await db.execute("SELECT COUNT(*) total FROM bills");

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