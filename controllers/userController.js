const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.userLogin = async (req, res) => {

  try {

    console.log(req.body);
    const { email, password } = req.body;

    const [row] = await db.execute('SELECT * FROM users where email=?', [email]);

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
        message: "Invalid credentials"
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
        email: user.email
      }
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: "Server error",});
  }
};

exports.userSignup = async (req, res) => {

  try {
    console.log(req.body)
    const { name, mobile, email, password } = req.body;

    const checkmobile = "select * from users where mobile=?";
    const [result] = await db.query(checkmobile, [mobile]);

    if (result.length > 0) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(
      `INSERT INTO users 
      (name,mobile,email,password)
      VALUES (?, ?, ?, ?)`,
      [
        name,
        mobile,
        email,
        hashedPassword
      ]
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });

  } catch (error) {
    res.status(500).json({ success: false, message: " Server error", error });
  }
};