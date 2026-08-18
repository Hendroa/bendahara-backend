const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Lokasi database
const dbPath = path.join(__dirname, "bendahara.db");

// Membuka atau membuat database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Gagal membuka database:", err.message);
  } else {
    console.log("=======================================");
    console.log(" DATABASE BUKU KAS BENDAHARA");
    console.log("=======================================");
  }
});

// Membuat semua tabel
db.serialize(() => {

  console.log("Membuat tabel users...");
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nama TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log("Membuat tabel pemasukan...");
  db.run(`
    CREATE TABLE IF NOT EXISTS pemasukan (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tanggal TEXT,
      kategori TEXT,
      nominal INTEGER,
      keterangan TEXT,
      dibuat_oleh INTEGER,
      status TEXT DEFAULT 'PENDING',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log("Membuat tabel pengeluaran...");
  db.run(`
    CREATE TABLE IF NOT EXISTS pengeluaran (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tanggal TEXT,
      kategori TEXT,
      nominal INTEGER,
      keterangan TEXT,
      dibuat_oleh INTEGER,
      status TEXT DEFAULT 'PENDING',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log("Membuat tabel approval...");
  db.run(`
    CREATE TABLE IF NOT EXISTS approval (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      transaksi_id INTEGER,
      jenis TEXT,
      disetujui_oleh INTEGER,
      status TEXT,
      catatan TEXT,
      tanggal DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log("Membuat tabel activity_log...");
  db.run(`
    CREATE TABLE IF NOT EXISTS activity_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      aktivitas TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log("Membuat tabel settings...");
  db.run(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nama TEXT,
      nilai TEXT
    )
  `);

});

// Menutup database
db.close((err) => {
  if (err) {
    console.error("❌ Gagal menutup database:", err.message);
  } else {
    console.log("");
    console.log("=======================================");
    console.log(" DATABASE BERHASIL DIBUAT");
    console.log("=======================================");
  }
});