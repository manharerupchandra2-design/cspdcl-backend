const db = require("../config/db");

// Add Consumer
// exports.addConsumer = async (req, res) => {
//   try {
//     const { consumer_no, name, address, mobile, connection_type } = req.body;

//     await db.execute(
//       `INSERT INTO consumers 
//       (consumer_no, name, address, mobile, connection_type) 
//       VALUES (?, ?, ?, ?, ?)`,
//       [consumer_no, name, address, mobile, connection_type]
//     );

//     res.json({ message: "Consumer Added Successfully" });

//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: error.message });
//   }
// };

// Get All Consumers
exports.getAllConsumers = async (req, res) => {
  try {
    const [rows] = await db.execute(`select consumers.*,
      meters.meter_no,meters.meter_type from consumers
      left join  meters on consumers.id=meters.consumer_id`);
    const [total_consumers] = await db.execute(`select count(*) as 
      total_consumers from consumers`);

    if (rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Empty"
      });
    }
    res.status(200).json({
      success: true,
      message: "Fetched all consumer successfully",
      data: {
        consumers: rows,
        total_consumers: total_consumers[0].total_consumers
      }

    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Single Consumer
exports.getSingleConsumer = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.execute(
      "SELECT * FROM consumers WHERE id = ?",
      [id]
    );

    res.json(rows[0]);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// exports.removeConsumer = async (req, res) => {
//   try {
//     const id = req.params.id;

//     const result=await db.query(
//       "delete from consumers where id=? ",
//       [id]
//     );

//     res.json({result,
//       message:"Deleted"});

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//     console.log(req.params.id);
//   }
// };


// exports.getConsumersPreviousBill = async (req, res) => {
//   try {

//     const { id } = req.params;
//     console.log(id);
//     const [rows] = await db.query(`
// select c.name,c.consumer_no,c.mobile,c.address , 
// m.meter_no,m.meter_type, 
// mr.previous_reading,mr.current_reading,mr.units,
// b.amount
// from consumers c 
// left join meters m
// on c.id=m.consumer_id 
// left join meter_readings mr on c.id=mr.consumer_id 
// left join bills b on
// mr.id=b.reading_id where c.id=? order by mr.reading_date desc limit 1;
// `, [id]);
//     res.status(200).json({
//       success: true,
//       message: "Got it",
//       data: rows
//     });

//   } catch (error) {
//     console.log(error)
//     res.status(500).json({ error: error.message });
//   }
// };

exports.getConsumersPreviousBill = async (req, res) => {
  try {

    const { id } = req.params;
    console.log(id);
    const [rows] = await db.query(`
select mr.current_reading, b.amount from meter_readings mr 
left join 
bills b on mr.id=b.reading_id where 
consumer_id=? order by mr.reading_date desc limit 1
`, [id]);
    res.status(200).json({
      success: true,
      message: "Got it",
      data: rows
    });

  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
};