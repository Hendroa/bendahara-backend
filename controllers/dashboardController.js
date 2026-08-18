const pool = require("../config/postgres");


// ========================================
// DASHBOARD
// ========================================

exports.getDashboard = async (req, res) => {

  try {

    // ====================================
    // TOTAL PEMASUKAN APPROVED
    // ====================================

    const pemasukanResult = await pool.query(`
      SELECT
        COALESCE(SUM(nominal), 0) AS total
      FROM pemasukan
      WHERE status = 'APPROVED'
    `);


    // ====================================
    // TOTAL PENGELUARAN APPROVED
    // ====================================

    const pengeluaranResult = await pool.query(`
      SELECT
        COALESCE(SUM(nominal), 0) AS total
      FROM pengeluaran
      WHERE status = 'APPROVED'
    `);


    // ====================================
    // TOTAL
    // ====================================

    const totalPemasukan =
      Number(pemasukanResult.rows[0]?.total || 0);

    const totalPengeluaran =
      Number(pengeluaranResult.rows[0]?.total || 0);


    // ====================================
    // SALDO
    // ====================================

    const saldo =
      totalPemasukan - totalPengeluaran;


    // ====================================
    // RESPONSE
    // ====================================

    return res.json({

      success: true,

      data: {

        totalPemasukan,

        totalPengeluaran,

        saldo,

      },

    });

  } catch (error) {

    console.error(
      "ERROR DASHBOARD:",
      error.message
    );

    return res.status(500).json({

      success: false,

      message:
        "Gagal mengambil data dashboard",

    });

  }

};