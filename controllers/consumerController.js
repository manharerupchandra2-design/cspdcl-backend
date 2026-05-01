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
