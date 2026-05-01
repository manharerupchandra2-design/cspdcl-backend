// const mysql = require("mysql2/promise");

// const db = mysql.createPool({
//     host: "localhost",
//     user: "root",
//     password: "Rup1432@",
//     database: "cspdcl_billing"
// });

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

// optional but recommended
const db = pool.promise();

module.exports = db;

// require("dotenv").config();

// const db = mysql.createPool({
//   host: process.env.DB_HOST,
//   port:process.env.DB_PORT,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME
// });

// module.exports = db;