const pool = require("../config/postgres");

// ========================================
// GET SEMUA PEMASUKAN
// ========================================

exports.getAllPemasukan = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id,
        p.tanggal,
        p.kategori,
        p.nominal,
        p.keterangan,
        p.dibuat_oleh,
        p.status,
        p.created_at,
        u.nama AS nama_pembuat
      FROM pemasukan p
      LEFT JOIN users u
        ON p.dibuat_oleh = u.id
      ORDER BY p.id DESC
    `);

    return res.json({
      success: true,
      data: result.rows,
    });

  } catch (error) {
    console.error(
      "Error mengambil pemasukan:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Gagal mengambil data pemasukan",
    });
  }
};


// ========================================
// GET PEMASUKAN BERDASARKAN ID
// ========================================

exports.getPemasukanById = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "ID pemasukan wajib diisi",
    });
  }

  try {
    const result = await pool.query(
      `
      SELECT
        p.id,
        p.tanggal,
        p.kategori,
        p.nominal,
        p.keterangan,
        p.dibuat_oleh,
        p.status,
        p.created_at,
        u.nama AS nama_pembuat
      FROM pemasukan p
      LEFT JOIN users u
        ON p.dibuat_oleh = u.id
      WHERE p.id = $1
      `,
      [id]
    );

    const row = result.rows[0];

    if (!row) {
      return res.status(404).json({
        success: false,
        message: "Data pemasukan tidak ditemukan",
      });
    }

    return res.json({
      success: true,
      data: row,
    });

  } catch (error) {
    console.error(
      "Error mengambil pemasukan:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Gagal mengambil data pemasukan",
    });
  }
};


// ========================================
// TAMBAH PEMASUKAN
// ========================================

exports.createPemasukan = async (req, res) => {
  const {
    tanggal,
    kategori,
    nominal,
    keterangan,
  } = req.body;

  // ======================================
  // USER LOGIN
  // ======================================

  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "User belum terautentikasi",
    });
  }

  // ======================================
  // VALIDASI
  // ======================================

  if (
    !tanggal ||
    !kategori ||
    nominal === undefined ||
    nominal === null
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Tanggal, kategori dan nominal wajib diisi",
    });
  }

  // ======================================
  // VALIDASI NOMINAL
  // ======================================

  const nominalNumber = Number(nominal);

  if (
    Number.isNaN(nominalNumber) ||
    nominalNumber <= 0
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Nominal harus berupa angka dan lebih besar dari 0",
    });
  }

  try {
    // ====================================
    // CEK USER
    // ====================================

    const userResult = await pool.query(
      `
      SELECT
        id,
        nama,
        role
      FROM users
      WHERE id = $1
      `,
      [userId]
    );

    const user = userResult.rows[0];

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User pembuat tidak ditemukan",
      });
    }

    // ====================================
    // INSERT PEMASUKAN
    // ====================================

    const result = await pool.query(
      `
      INSERT INTO pemasukan
      (
        tanggal,
        kategori,
        nominal,
        keterangan,
        dibuat_oleh,
        status
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        $5,
        'PENDING'
      )
      RETURNING
        id,
        tanggal,
        kategori,
        nominal,
        keterangan,
        dibuat_oleh,
        status,
        created_at
      `,
      [
        tanggal,
        kategori,
        nominalNumber,
        keterangan || "",
        userId,
      ]
    );

    const pemasukan = result.rows[0];

    return res.status(201).json({
      success: true,
      message:
        "Pemasukan berhasil dibuat dan menunggu approval",

      data: {
        id: pemasukan.id,
        tanggal: pemasukan.tanggal,
        kategori: pemasukan.kategori,
        nominal: Number(pemasukan.nominal),
        keterangan: pemasukan.keterangan,
        dibuat_oleh: pemasukan.dibuat_oleh,
        nama_pembuat: user.nama,
        status: pemasukan.status,
        created_at: pemasukan.created_at,
      },
    });

  } catch (error) {
    console.error(
      "Error menambah pemasukan:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Gagal menyimpan pemasukan",
    });
  }
};


// ========================================
// UPDATE PEMASUKAN
// ========================================

exports.updatePemasukan = async (req, res) => {
  const { id } = req.params;

  const {
    tanggal,
    kategori,
    nominal,
    keterangan,
  } = req.body;

  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "User belum terautentikasi",
    });
  }

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "ID pemasukan wajib diisi",
    });
  }

  if (
    !tanggal ||
    !kategori ||
    nominal === undefined ||
    nominal === null
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Tanggal, kategori dan nominal wajib diisi",
    });
  }

  const nominalNumber = Number(nominal);

  if (
    Number.isNaN(nominalNumber) ||
    nominalNumber <= 0
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Nominal harus lebih besar dari 0",
    });
  }

  try {
    const result = await pool.query(
      `
      UPDATE pemasukan
      SET
        tanggal = $1,
        kategori = $2,
        nominal = $3,
        keterangan = $4
      WHERE id = $5
        AND dibuat_oleh = $6
        AND status = 'PENDING'
      RETURNING
        id,
        tanggal,
        kategori,
        nominal,
        keterangan,
        dibuat_oleh,
        status,
        created_at
      `,
      [
        tanggal,
        kategori,
        nominalNumber,
        keterangan || "",
        id,
        userId,
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Data tidak ditemukan, bukan milik Anda, atau sudah diproses",
      });
    }

    return res.json({
      success: true,
      message: "Pemasukan berhasil diperbarui",
      data: result.rows[0],
    });

  } catch (error) {
    console.error(
      "Error update pemasukan:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Gagal mengubah pemasukan",
    });
  }
};


// ========================================
// DELETE PEMASUKAN
// ========================================

exports.deletePemasukan = async (req, res) => {
  const { id } = req.params;

  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "User belum terautentikasi",
    });
  }

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "ID pemasukan wajib diisi",
    });
  }

  try {
    const result = await pool.query(
      `
      DELETE FROM pemasukan
      WHERE id = $1
        AND dibuat_oleh = $2
        AND status = 'PENDING'
      RETURNING id
      `,
      [
        id,
        userId,
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Data tidak ditemukan, bukan milik Anda, atau sudah diproses",
      });
    }

    return res.json({
      success: true,
      message: "Pemasukan berhasil dihapus",
    });

  } catch (error) {
    console.error(
      "Error menghapus pemasukan:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Gagal menghapus pemasukan",
    });
  }
};


// ========================================
// EXPORT SELESAI
// ========================================