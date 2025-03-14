const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "sql.freedb.tech",
    user: "freedb_webdevsamsantech",
    password: "pVhHysv9$rf7#YF",
    database: "freedb_webprogsamsantech",
});

db.connect((err) => {
    if (err) {
        console.error("MySQL connection error:", err);
        return;
    }
    console.log("Connected to MySQL");
});

module.exports = db;
