const db = require("../config/db");
const calculateEnergyCharge = require("../utils/calculateBill");

exports.generateBill = async (req, res) => {

  try {

    const { consumer_id } = req.body;

    // Get consumer
    const [consumer] = await db.execute(
      "SELECT * FROM consumers WHERE id = ?",
      [consumer_id]
    );

    if (consumer.length === 0) {
      return res.status(404).json({ message: "Consumer not found" });
    }

    const connectionType = consumer[0].connection_type;

    // Get latest reading
    const [lastReading] = await db.execute(
      "SELECT * FROM meter_readings WHERE consumer_id = ? ORDER BY id DESC LIMIT 1",
      [consumer_id]
    );

    if (lastReading.length === 0) {
      return res.status(400).json({ message: "No reading found" });
    }

    const units = lastReading[0].unit_consumed;

    // Calculate slab-wise energy charge
    const energyCharge = await calculateEnergyCharge(
      connectionType,
      units,
      db
    );

    const fixedCharge = 50;
    const tax = energyCharge * 0.05;
    const totalAmount = energyCharge + fixedCharge + tax;

    // Insert bill
    await db.execute(
      `INSERT INTO bills 
      (consumer_id, reading_id, total_unit, energy_charge, fixed_charge, tax, total_amount, bill_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE())`,
      [
        consumer_id,
        lastReading[0].id,
        units,
        energyCharge,
        fixedCharge,
        tax,
        totalAmount
      ]
    );

    res.json({
      message: "Bill Generated Successfully",
      units,
      energyCharge,
      fixedCharge,
      tax,
      totalAmount
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};