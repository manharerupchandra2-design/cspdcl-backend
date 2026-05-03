
require("dotenv").config();
const mysql = require("mysql2");

const pool = mysql.createPool({
  uri: process.env.DATABASE_URL, // 🔥 yaha PUBLIC URL
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection((err, conn) => {
  if (err) {
    console.log("DB ERROR ❌", err);
  } else {
    console.log("DB Connected ✅");
    conn.release();
  }
});


const db = pool.promise();

module.exports = db;

