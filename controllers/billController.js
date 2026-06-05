const db = require("../config/db");
const calculateEnergyCharge = require("../utils/calculateBill");

exports.setBilling = async (req, res) => {
  try {
    const { reading_id} = req.params;
    const {category}=req.body;

    const [row1] = await db.execute(
      "SELECT units FROM meter_readings WHERE id=?",
      [reading_id]
    );

    if (row1.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Reading not found"
      });
    }

    const units = row1[0].units;

    const [row2] = await db.execute(
      `SELECT rate_per_unit, fixed_charge
       FROM tariffs
       WHERE category=?
       AND ? BETWEEN min_units AND max_units`,
      [category, units]
    );

    if (row2.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Tariff not found"
      });
    }

    const rate_per_unit = row2[0].rate_per_unit;
    const fixed_charge = parseFloat(row2[0].fixed_charge);

    const amount = (units * rate_per_unit) + fixed_charge;

    await db.execute(
      "INSERT INTO bills(reading_id, amount) VALUES(?, ?)",
      [reading_id, amount]
    );
    console.log(amount)
    console.log(fixed_charge)
    res.status(200).json({
      success: true,
      message: "Bill calculated",
      amount:amount,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

