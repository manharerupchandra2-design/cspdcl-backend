const db = require("../config/db");

// Add Consumer
exports.addConsumer = async (req, res) => {
  try {
    const { consumer_no, name, address, mobile, connection_type } = req.body;

    await db.execute(
      `INSERT INTO consumers 
      (consumer_no, name, address, mobile, connection_type) 
      VALUES (?, ?, ?, ?, ?)`,
      [consumer_no, name, address, mobile, connection_type]
    );

    res.json({ message: "Consumer Added Successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// Get All Consumers
exports.getAllConsumers = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM consumers");
    res.status(200).json({
      success:true,
      message:"Fetched all Consumer successfully",
      data:rows});

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

exports.removeConsumer = async (req, res) => {
  try {
    const id = req.params.id;

    const result=await db.query(
      "delete from consumers where id=? ",
      [id]
    );

    res.json({result,
      message:"Deleted"});

  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(req.params.id);
  }
};


exports.getAllConsumersDetail = async (req, res) => {
  try {

    const {bp_no}=req.params;
console.log(bp_no);
    const [rows] = await db.query(`select c.name,c.address,c.mobile,c.bp_no,
      m.meter_no, m.meter_type,
      mr.previous_reading, mr.reading_date, mr.reading_value, mr.unit_consumed, 
      b.bill_date,b.total_amount 
      from consumers c join meters m on c.bp_no=m.bp_no join meter_readings mr on m.meter_id=mr.meter_id join bills b on b.reading_id=mr.id  
      where c.bp_no=? order by bill_date desc limit 1;`,[bp_no]);
    res.status(200).json({
      success:true,
      message:"Fetched all consumers detaile successfully",
      data:rows});

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};