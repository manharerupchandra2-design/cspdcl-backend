const db = require("../config/db");
const calculateEnergyCharge = require("../utils/calculateBill");

exports.setBilling = async (req, res) => {
  try {

    const { reading_id } = req.params;

    const sql1 = `
      SELECT
        c.name,
        c.consumer_no,
        m.meter_no,
        m.meter_type,
        mr.previous_reading,
        mr.current_reading,
        mr.units
      FROM meter_readings mr
      JOIN consumers c
        ON mr.consumer_id = c.id
      JOIN meters m
        ON mr.meter_id = m.id
      WHERE mr.id = ?
    `;

    const [row1] = await db.execute(sql1, [reading_id]);

    if (row1.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Reading not found"
      });
    }

    const data = row1[0];

    const sql2 = `
      SELECT rate_per_unit,fixed_charge
      FROM tariffs
      WHERE category=?
      AND ? BETWEEN min_units AND max_units
    `;

    const [row2] = await db.execute(
      sql2,
      [data.meter_type, data.units]
    );

    if (row2.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Tariff not found"
      });
    }

    const rate = Number(row2[0].rate_per_unit);
    const fixed = Number(row2[0].fixed_charge);

    const amount = (data.units * rate) + fixed;

    const sql3 =
      `INSERT INTO bills(reading_id,amount)
       VALUES(?,?)`;

    const [result] =
      await db.execute(sql3, [reading_id, amount]);


      if(result.affectedRows>0){
        await db.execute("update meter_readings set bill_status='Generated' where id=?",[reading_id]);
      }

    res.status(200).json({
      success: true,
      message: "Bill generated",

      data: {
        bill_id: result.insertId,
        consumer_name: data.name,
        consumer_no: data.consumer_no,
        meter_no: data.meter_no,
        previous_reading: data.previous_reading,
        current_reading: data.current_reading,
        units: data.units,
        amount: amount
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
exports.getBillHistory = async (req, res) => {
  try {
    const readerId = req.user.id; // ← token se

 console.log('USER:', req.user);        // ← add karo
    console.log('HEADERS:', req.headers);  // ← add karo
    const [readerRow] = await db.execute(
      'SELECT zone FROM meter_readers WHERE id = ?',
      [readerId]
    );
     console.log('READER ROW:', readerRow);

    const readerZone = readerRow[0].zone;
console.log('ZONE:', readerZone);
    const [rows] = await db.execute(`
      SELECT
    b.id AS bill_id,
    b.amount,
    mr.reading_date AS created_at,
    c.name AS consumer_name,
    c.consumer_no,
    m.meter_no,
    mr.previous_reading,
    mr.current_reading,
    mr.units
  FROM bills b
  JOIN meter_readings mr ON mr.id = b.reading_id
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
    console.log('ERROR:', error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

