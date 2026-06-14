const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.meterreaderLogin = async (req, res) => {

  try {

    console.log(req.body);
    const { email, password } = req.body;
    if (!email?.trim() || !password.trim()) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      })
    }


    const [row] = await db.execute('SELECT * FROM meter_readers where email=?', [email]);

    if (row.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    const user = row[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect Password"
      });

    }

    const token = jwt.sign({
      id: user.id, email: user.email
    },
      process.env.JWT_SECRET,
      { expiresIn: "7d" });

    return res.json({
      success: true,
      message: "Login successfull",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        zone: user.zone
      }
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: "Server error", });
  }
};

exports.meterreaderSignup = async (req, res) => {
  try {

    const { name, mobile, email, password, zone } = req.body;
    if (!name?.trim() || !mobile?.trim() || !email?.trim() || !password?.trim() || !zone?.trim()) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      })
    }

    const checkUser = `
    SELECT * FROM meter_readers
    WHERE mobile=? OR email=?`;

    const [result] = await db.query(checkUser, [mobile, email]);

    if (result.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Mobile or Email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(
      `INSERT INTO meter_readers
      (name,mobile,zone,email,password)
      VALUES (?, ?, ?, ?, ?)`,
      [name, mobile, zone, email, hashedPassword]
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};