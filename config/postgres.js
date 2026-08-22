const { Pool } = require("pg");

require("dotenv").config();

// ============================================================
// POSTGRESQL / SUPABASE CONNECTION
// ============================================================
//
// Konfigurasi dibuat ringan untuk Vercel Serverless.
// Jangan membuat terlalu banyak koneksi ke Supabase.
//
// ============================================================

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  ssl: {
    rejectUnauthorized: false,
  },

  // ==========================================================
  // SERVERLESS CONNECTION LIMIT
  // ==========================================================

  max: 3,

  // Waktu tunggu mendapatkan koneksi dari pool
  connectionTimeoutMillis: 10000,

  // Tutup koneksi yang idle setelah 10 detik
  idleTimeoutMillis: 10000,

  // Jangan menunggu terlalu lama saat pool penuh
  allowExitOnIdle: true,
});

// ============================================================
// CONNECTION EVENT
// ============================================================

pool.on("connect", () => {
  console.log(
    "✅ PostgreSQL / Supabase berhasil terhubung"
  );
});

// ============================================================
// ERROR EVENT
// ============================================================

pool.on("error", (err) => {
  console.error(
    "❌ PostgreSQL error:",
    err.message
  );
});

// ============================================================
// EXPORT
// ============================================================

module.exports = pool;
