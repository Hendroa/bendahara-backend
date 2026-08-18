const pool = require("../config/postgres");

// ========================================
// GET LAPORAN KEUANGAN
// HANYA TRANSAKSI APPROVED
// ========================================

exports.getLaporan = async (req, res) => {

  try {

    // ====================================
    // AMBIL PEMASUKAN APPROVED
    // ====================================

    const pemasukanResult = await pool.query(`
      SELECT
        'PEMASUKAN' AS jenis,
        id,
        tanggal,
        kategori,
        nominal,
        keterangan,
        dibuat_oleh,
        status,
        created_at
      FROM pemasukan
      WHERE status = 'APPROVED'
    `);


    // ====================================
    // AMBIL PENGELUARAN APPROVED
    // ====================================

    const pengeluaranResult = await pool.query(`
      SELECT
        'PENGELUARAN' AS jenis,
        id,
        tanggal,
        kategori,
        nominal,
        keterangan,
        dibuat_oleh,
        status,
        created_at
      FROM pengeluaran
      WHERE status = 'APPROVED'
    `);


    // ====================================
    // GABUNG DATA
    // ====================================

    const rows = [
      ...pemasukanResult.rows,
      ...pengeluaranResult.rows,
    ];


    // ====================================
    // URUTKAN
    // ====================================

    rows.sort((a, b) => {

      const tanggalA =
        new Date(a.tanggal).getTime();

      const tanggalB =
        new Date(b.tanggal).getTime();

      if (tanggalA !== tanggalB) {
        return tanggalB - tanggalA;
      }

      return (
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
      );

    });


    // ====================================
    // HITUNG TOTAL
    // ====================================

    let totalPemasukan = 0;
    let totalPengeluaran = 0;


    rows.forEach((row) => {

      const nominal =
        Number(row.nominal || 0);


      if (row.jenis === "PEMASUKAN") {

        totalPemasukan += nominal;

      }


      if (row.jenis === "PENGELUARAN") {

        totalPengeluaran += nominal;

      }

    });


    // ====================================
    // HITUNG SALDO
    // ====================================

    const saldo =
      totalPemasukan - totalPengeluaran;


    // ====================================
    // RESPONSE
    // ====================================

    return res.json({

      success: true,

      summary: {

        totalPemasukan,

        totalPengeluaran,

        saldo,

        jumlahTransaksi:
          rows.length,

      },

      data: rows,

    });

  } catch (error) {

    console.error(
      "ERROR GET LAPORAN:",
      error.message
    );


    return res.status(500).json({

      success: false,

      message:
        "Gagal mengambil laporan",

    });

  }

};