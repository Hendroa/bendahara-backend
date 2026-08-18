const pool = require("../config/postgres");

// ============================================================
// GET SEMUA TRANSAKSI PENDING
// ============================================================

exports.getPending = async (req, res) => {
  try {
    const result = await pool.query(`
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
      WHERE status = 'PENDING'

      UNION ALL

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
      WHERE status = 'PENDING'

      ORDER BY created_at DESC
    `);

    return res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error(
      "ERROR GET PENDING:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Gagal mengambil transaksi pending",
    });
  }
};

// ============================================================
// APPROVE PEMASUKAN
// ============================================================

exports.approvePemasukan = async (
  req,
  res
) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      UPDATE pemasukan
      SET status = 'APPROVED'
      WHERE id = $1
      AND status = 'PENDING'
      RETURNING id
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Data tidak ditemukan atau sudah diproses",
      });
    }

    return res.json({
      success: true,
      message:
        "Pemasukan berhasil disetujui",
    });
  } catch (error) {
    console.error(
      "ERROR APPROVE PEMASUKAN:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Gagal menyetujui pemasukan",
    });
  }
};

// ============================================================
// REJECT PEMASUKAN
// ============================================================

exports.rejectPemasukan = async (
  req,
  res
) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      UPDATE pemasukan
      SET status = 'REJECTED'
      WHERE id = $1
      AND status = 'PENDING'
      RETURNING id
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Data tidak ditemukan atau sudah diproses",
      });
    }

    return res.json({
      success: true,
      message:
        "Pemasukan berhasil ditolak",
    });
  } catch (error) {
    console.error(
      "ERROR REJECT PEMASUKAN:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Gagal menolak pemasukan",
    });
  }
};

// ============================================================
// APPROVE PENGELUARAN
// ============================================================

exports.approvePengeluaran = async (
  req,
  res
) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      UPDATE pengeluaran
      SET status = 'APPROVED'
      WHERE id = $1
      AND status = 'PENDING'
      RETURNING id
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Data tidak ditemukan atau sudah diproses",
      });
    }

    return res.json({
      success: true,
      message:
        "Pengeluaran berhasil disetujui",
    });
  } catch (error) {
    console.error(
      "ERROR APPROVE PENGELUARAN:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Gagal menyetujui pengeluaran",
    });
  }
};

// ============================================================
// REJECT PENGELUARAN
// ============================================================

exports.rejectPengeluaran = async (
  req,
  res
) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      UPDATE pengeluaran
      SET status = 'REJECTED'
      WHERE id = $1
      AND status = 'PENDING'
      RETURNING id
      `,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Data tidak ditemukan atau sudah diproses",
      });
    }

    return res.json({
      success: true,
      message:
        "Pengeluaran berhasil ditolak",
    });
  } catch (error) {
    console.error(
      "ERROR REJECT PENGELUARAN:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Gagal menolak pengeluaran",
    });
  }
};