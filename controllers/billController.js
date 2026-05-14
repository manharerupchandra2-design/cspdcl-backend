const db = require("../config/db");
const calculateEnergyCharge = require("../utils/calculateBill");

exports.generateBill = async (req, res) => {
  try {
    const { bp_no } = req.params;
    const { reading_value } = req.body;

    if (!reading_value) {
      return res.status(400).json({ message: "Current reading is required" });
    }

    // 1. Get consumer details
    const [consumerData] = await db.execute(
      "SELECT * FROM consumers WHERE bp_no = ?",
      [bp_no]
    );

    if (consumerData.length === 0) {
      return res.status(404).json({ message: "Consumer not found" });
    }

    const consumer = consumerData[0];

    // 2. Get last reading
    const [lastReadingData] = await db.execute(
      "SELECT * FROM meter_readings WHERE bp_no = ? ORDER BY reading_date DESC LIMIT 1",
      [bp_no]
    );

    let previous_reading = 0;

    if (lastReadingData.length > 0) {
      previous_reading = lastReadingData[0].reading_value;
    }

    // 3. Unit calculation
    const units =reading_value - previous_reading;

    if (units < 0) {
      return res.status(400).json({ message: "Invalid reading" });
    }

    // 4. Tariff logic (simple slab)
    let amount = 0;

    if (units <= 100) {
      amount = units * 3;
    } else if (units <= 200) {
      amount = (100 * 3) + (units - 100) * 5;
    } else {
      amount = (100 * 3) + (100 * 5) + (units - 200) * 7;
    }

    // 5. Fixed charge
    const fixed_charge = consumer.connection_type === "commercial" ? 150 : 50;

    const total_amount = amount + fixed_charge;

    // 6. Save reading
    await db.execute(
      "INSERT INTO meter_readings (bp_no, reading_value, previous_reading, unit_consumed) VALUES (?, ?, ?, ?)",
      [bp_no,  reading_value, previous_reading, units]
    );

    // 7. Save bill
    await db.execute(
      "INSERT INTO bills (bp_no, total_unit, amount, fixed_charge, total_amount) VALUES (?, ?, ?, ?, ?)",
      [bp_no, units, total_amount, fixed_charge, total_amount]
    );

    res.status(200).json({
      message: "Bill generated successfully",
      data: {
        bp_no,
        previous_reading,
        reading_value,
        units,
        amount,
        fixed_charge,
        total_amount,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

