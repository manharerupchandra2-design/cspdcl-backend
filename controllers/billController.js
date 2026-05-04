const db = require("../config/db");
const calculateEnergyCharge = require("../utils/calculateBill");

exports.generateBill = async (req, res) => {

  try {

    const { bp_no } = req.params;

    // Get consumer
    const [consumer] = await db.execute(
      "SELECT * FROM consumers WHERE bp_no = ?",
      [bp_no]
    );

    if (consumer.length === 0) {
      return res.status(404).json({ message: "Consumer not found" });
    }

    const connectionType = consumer[0].connection_type;

    // Get latest reading
    const [previous_reading] = await db.execute(
      "SELECT * FROM meter_readings WHERE bp_no = ? ORDER BY id DESC LIMIT 1",
      [bp_no]
    );

    if (previous_reading.length === 0) {
      return res.status(400).json({ message: "No reading found" });
    }

    const units = previous_reading[0].unit_consumed;

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
      (bp_no, reading_id, total_unit, energy_charge, fixed_charge, tax, total_amount, bill_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE())`,
      [
        bp_no,
        previous_reading[0].id,
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