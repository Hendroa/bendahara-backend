const pool = require("./config/postgres");

async function testDatabase() {
  try {
    const result = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM users) AS users,
        (SELECT COUNT(*) FROM pemasukan) AS pemasukan,
        (SELECT COUNT(*) FROM pengeluaran) AS pengeluaran
    `);

    console.log("====================================");
    console.log("SUPABASE BERHASIL TERHUBUNG");
    console.log("====================================");

    console.log(result.rows[0]);

  } catch (error) {
    console.error("❌ GAGAL TERHUBUNG KE SUPABASE");
    console.error(error.message);

  } finally {
    await pool.end();
  }
}

testDatabase();