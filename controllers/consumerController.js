const db = require("../config/db");


exports.getConsumers = async (req, res) => {
  try {
    // Token se reader id lo
    const readerId = req.user.id;

    // Pehle reader ka zone nikalo
    const [readerRow] = await db.execute(
      'SELECT zone FROM meter_readers WHERE id = ?',
      [readerId]
    );

    if (readerRow.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Reader not found"
      });
    }

    const readerZone = readerRow[0].zone;

    const sql = `
      SELECT
        c.id,
        c.consumer_no,
        c.name,
        c.mobile,
        c.address,
        m.id AS meter_id,
        m.meter_no,
        m.meter_type
      FROM consumers c
      LEFT JOIN meters m ON c.id = m.consumer_id
      WHERE c.zone = ?          
      ORDER BY c.id DESC
    `;

    const [rows] = await db.execute(sql, [readerZone]);

    res.status(200).json({
      success: true,
      message: "Fetched consumers successfully",
      data: {
        total_consumers: rows.length,
        consumers: rows
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

exports.getConsumerDetail = async (req, res) => {
  try {

    const { consumer_id } = req.params;

    const sql1 = `
      SELECT
      c.id,
      c.consumer_no,
      c.name,
      c.mobile,
      c.address,

      m.id AS meter_id,
      m.meter_no,
      m.meter_type

      FROM consumers c

      LEFT JOIN meters m
      ON c.id = m.consumer_id

      WHERE c.id = ?
    `;

    const [consumerRow] =
      await db.execute(sql1, [consumer_id]);

    if (consumerRow.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Consumer not found"
      });
    }

    const sql2 = `
      SELECT
      mr.previous_reading,
      mr.current_reading,
      mr.units,
      b.amount

      FROM meter_readings mr

      LEFT JOIN bills b
      ON mr.id = b.reading_id

      WHERE mr.consumer_id = ?

      ORDER BY mr.id DESC
      LIMIT 1
    `;

    const [billRow] =
      await db.execute(sql2, [consumer_id]);

    res.status(200).json({
      success: true,
      message: "Consumer detail fetched",
      data: {
        consumer: consumerRow[0],

        previous_bill:
          billRow.length > 0
            ? billRow[0]
            : null
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

exports.getPendingConsumers = async (req, res) => {
  try {
    const readerId = req.user.id;

    const [readerRow] = await db.execute(
      'SELECT zone FROM meter_readers WHERE id = ?',
      [readerId]
    );

    const readerZone = readerRow[0].zone;

    const [rows] = await db.execute(`
      SELECT
        c.id,
        c.consumer_no,
        c.name,
        c.mobile,
        c.address,
        m.id AS meter_id,
        m.meter_no,
        m.meter_type
      FROM consumers c
      LEFT JOIN meters m ON m.consumer_id = c.id
      WHERE c.zone = ?
      AND c.id NOT IN (
        SELECT DISTINCT mr.consumer_id
        FROM meter_readings mr
        WHERE DATE(mr.reading_date) = CURDATE()
      )
      ORDER BY c.id ASC
    `, [readerZone]);

    res.status(200).json({
      success: true,
      data: rows,
      total: rows.length
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};