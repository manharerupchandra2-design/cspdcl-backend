
require("dotenv").config();
const mysql = require("mysql2");




// const pool=mysql.createPool({
//   host:"localhost",
//   user:"root",
//   password:"Rup1432@",
//   database:"cspdcl_billing"
// })

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

