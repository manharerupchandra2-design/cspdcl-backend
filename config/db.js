const mysql = require("mysql2/promise");

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Rup1432@",
    database: "cspdcl_billing"
});

module.exports = db;