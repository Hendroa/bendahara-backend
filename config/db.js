const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(
  __dirname,
  "../database/bendahara.db"
);

const db = new sqlite3.Database(
  dbPath,
  (err) => {

    if (err) {

      console.error(
        "❌ Gagal koneksi database:",
        err.message
      );

    } else {

      console.log(
        "✅ Database berhasil terhubung"
      );

    }

  }
);

module.exports = db;