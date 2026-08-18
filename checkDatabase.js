const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database(
  "./database/bendahara.db",
  (err) => {
    if (err) {
      console.error("Gagal membuka database:", err.message);
      process.exit(1);
    }

    console.log("====================================");
    console.log("DATABASE BERHASIL DIBUKA");
    console.log("====================================");
  }
);

db.all(
  `
  SELECT name
  FROM sqlite_master
  WHERE type = 'table'
    AND name NOT LIKE 'sqlite_%'
  ORDER BY name
  `,
  [],
  (err, tables) => {
    if (err) {
      console.error("Gagal mengambil tabel:", err.message);
      db.close();
      process.exit(1);
    }

    console.log("\n====================================");
    console.log("DAFTAR TABEL");
    console.log("====================================");

    tables.forEach((table) => {
      console.log(`- ${table.name}`);
    });

    let selesai = 0;

    if (tables.length === 0) {
      console.log("\nTidak ada tabel.");
      db.close();
      return;
    }

    tables.forEach((table) => {
      db.all(
        `PRAGMA table_info("${table.name}")`,
        [],
        (err, columns) => {
          if (err) {
            console.error(
              `Gagal membaca tabel ${table.name}:`,
              err.message
            );
          } else {
            console.log(
              `\n====================================`
            );
            console.log(
              `STRUKTUR TABEL: ${table.name}`
            );
            console.log(
              `====================================`
            );

            columns.forEach((column) => {
              console.log(
                `${column.name} | ${column.type} | PK=${column.pk} | NOT NULL=${column.notnull} | DEFAULT=${column.dflt_value}`
              );
            });
          }

          selesai++;

          if (selesai === tables.length) {
            console.log(
              "\n===================================="
            );
            console.log("PEMERIKSAAN SELESAI");
            console.log(
              "===================================="
            );

            db.close();
          }
        }
      );
    });
  }
);