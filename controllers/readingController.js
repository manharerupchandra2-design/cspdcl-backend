const db = require("../config/db");
const upload = require('../middleware/upload');

// // Add Reading
// exports.addReading = async (req, res) => {
//   try {

//     const { bp_no, meter_id, reading_value } = req.body;

//     // Get last reading
//     const [lastReading] = await db.execute(
//       "SELECT * FROM meter_readings WHERE bp_no = ? ORDER BY id DESC LIMIT 1",
//       [bp_no]
//     );

//     const previousReading = lastReading.length > 0
//       ? lastReading[0].reading_value
//       : 0;

//     const units = reading_value - previousReading;

//     await db.execute(
//       `INSERT INTO meter_readings 
//       (bp_no, meter_id, reading_value, previous_reading, unit_consumed)
//       VALUES (?, ?, ?, ?, ?)`,
//       [bp_no, meter_id, reading_value, previousReading, units]
//     );

//     res.json({
//       message: "Reading Added Successfully",
//       previousReading,
//       units
//     });

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


// // Get Readings by Consumer
// exports.getReadingsByConsumer = async (req, res) => {
//   try {

//     const { consumerId } = req.params;

//     const [rows] = await db.execute(
//       "SELECT * FROM meter_readings WHERE consumer_id = ? ORDER BY id DESC",
//       [consumerId]
//     );

//     res.json(rows);

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


// exports.setReading = async (req, res) => {
//   try {

//     const { consumer_id } = req.params;
//     const {
//       meter_id,
//       reader_id,
//       current_reading,
//       meter_photo
//     } = req.body;

//     const sql1 = `select current_reading from meter_readings 
//                 where consumer_id=? 
//                 order by id desc limit 1`;
//     const [row1] = await db.query(sql1, [consumer_id]);

//     let pre_reading = 0;
//     if (row1.length > 0) {
//       pre_reading = row1[0].current_reading;
//     }

//     if (current_reading < pre_reading) {
//       return res.status(400).json({
//         success: false,
//         message: "current reading problem"
//       })
//     }
//     console.log(consumer_id);
//     const units = current_reading - pre_reading;

//     const sql2 = `insert into meter_readings
//       (consumer_id,
//       meter_id,
//       reader_id,
//       previous_reading,
//       current_reading,
//       units,
//       meter_photo)
//       values(?,?,?,?,?,?,?)`;

//     const [result] = await db.execute(sql2, [consumer_id, meter_id, reader_id, pre_reading, current_reading, units, meter_photo
//     ]);
//     res.status(200).json({
//       success: true,
//       message: "Reading submitted",
//       reading_id: result.insertId
//     });

//   } catch (error) {
//     console.log(error)
//     res.status(500).json({ error: error.message });
//   }
// };

exports.setReading = async (req, res) => {
  try {
      console.log('BODY:', req.body);
  console.log('FILE:', req.file);  
    const { consumerId } = req.params;

    const {
      meter_id,
      reader_id,
      current_reading,
      
    } = req.body;
    const meter_photo = req.file
  ? `${req.protocol}://${req.get('host')}/api/uploads/${req.file.filename}`
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

    // Previous reading nikal lo
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
    const [rows] = await db.query(`
 SELECT
        mr.id,
        mr.current_reading,
        mr.reading_date,
        mr.meter_photo,

        c.id AS consumer_id,
        c.name AS consumer_name,
        c.consumer_no,

        m.id AS meter_id,
        m.meter_no

      FROM meter_readings mr
      JOIN consumers c ON c.id = mr.consumer_id
      JOIN meters m ON m.id = mr.meter_id

      ORDER BY mr.reading_date DESC
    `);

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

exports.editReading = async (req, res) => {
  try {
    const { reading_id } = req.params
    const { current_reading } = req.body;
    const [previousBill] = await db.query(
      `SELECT previous_reading
       FROM meter_readings
       WHERE id = ?`,
      [reading_id]
    );

    const previousReading =
      previousBill.length > 0
        ? previousBill[0].previous_reading
        : 0;

    const unitsConsumed =
      current_reading - previousReading;

    if (unitsConsumed < 0) {
      return res.status(400).json({
        success: false,
        message:
          "Current reading cannot be less than previous reading",
      });
    }
    const sql = "update meter_readings set current_reading=?,units=? where id=?";

    await db.execute(sql, [current_reading, unitsConsumed, reading_id])
  

    return res.status(200).json({
      success: true,
      message:
        "Reading submitted successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}