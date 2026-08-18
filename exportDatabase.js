const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");

const db = new sqlite3.Database(
  "./database/bendahara.db",
  (err) => {
    if (err) {
      console.error(
        "Gagal membuka database:",
        err.message
      );
      process.exit(1);
    }

    console.log("Database SQLite berhasil dibuka.");
  }
);

const tables = [
  "users",
  "pemasukan",
  "pengeluaran",
  "approval",
  "settings",
  "activity_log",
];

const result = {};

let completed = 0;

tables.forEach((table) => {
  db.all(
    `SELECT * FROM "${table}"`,
    [],
    (err, rows) => {
      if (err) {
        console.error(
          `Gagal membaca tabel ${table}:`,
          err.message
        );

        db.close();
        process.exit(1);
      }

      result[table] = rows;

      console.log(
        `${table}: ${rows.length} data`
      );

      completed++;

      if (completed === tables.length) {
        fs.writeFileSync(
          "./database-export.json",
          JSON.stringify(result, null, 2)
        );

        console.log("");
        console.log(
          "===================================="
        );
        console.log(
          "EXPORT BERHASIL"
        );
        console.log(
          "===================================="
        );
        console.log(
          "File: database-export.json"
        );

        db.close();
      }
    }
  );
});