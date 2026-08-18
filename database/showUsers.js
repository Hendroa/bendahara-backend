const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const db = new sqlite3.Database(
  path.join(__dirname, "bendahara.db")
);

db.all(
  "SELECT id, nama, email, role FROM users",
  [],
  (err, rows) => {

    if (err) {
      console.log(err.message);
      return;
    }

    console.log("");
    console.log("========================================");
    console.log("       DATA USER BENDAHARA");
    console.log("========================================");
    console.table(rows);

    db.close();

  }
);