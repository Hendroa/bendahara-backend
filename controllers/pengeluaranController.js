const pool = require("../config/postgres");


// ========================================
// GET SEMUA PENGELUARAN
// ========================================

exports.getAllPengeluaran = async (req, res) => {

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

      FROM pengeluaran p

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
      "Error mengambil pengeluaran:",
      error.message
    );

    return res.status(500).json({

      success: false,

      message:
        "Gagal mengambil data pengeluaran",

    });

  }

};


// ========================================
// TAMBAH PENGELUARAN
// ========================================

exports.createPengeluaran = async (req, res) => {

  const {
    tanggal,
    kategori,
    nominal,
    keterangan,
    dibuat_oleh,
  } = req.body;


  // ======================================
  // VALIDASI DATA
  // ======================================

  if (
    !tanggal ||
    !kategori ||
    nominal === undefined ||
    nominal === null ||
    !dibuat_oleh
  ) {

    return res.status(400).json({

      success: false,

      message:
        "Tanggal, kategori, nominal dan pembuat wajib diisi",

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
        "Nominal harus lebih besar dari 0",

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
      [dibuat_oleh]
    );

    const user = userResult.rows[0];


    if (!user) {

      return res.status(404).json({

        success: false,

        message:
          "User pembuat tidak ditemukan",

      });

    }


    // ====================================
    // INSERT PENGELUARAN
    // ====================================

    const result = await pool.query(
      `
      INSERT INTO pengeluaran
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
        dibuat_oleh,
      ]
    );


    const pengeluaran = result.rows[0];


    // ====================================
    // RESPONSE
    // ====================================

    return res.status(201).json({

      success: true,

      message:
        "Pengeluaran berhasil dibuat dan menunggu approval",

      data: {

        id:
          pengeluaran.id,

        tanggal:
          pengeluaran.tanggal,

        kategori:
          pengeluaran.kategori,

        nominal:
          Number(pengeluaran.nominal),

        keterangan:
          pengeluaran.keterangan,

        dibuat_oleh:
          pengeluaran.dibuat_oleh,

        nama_pembuat:
          user.nama,

        status:
          pengeluaran.status,

        created_at:
          pengeluaran.created_at,

      },

    });

  } catch (error) {

    console.error(
      "Error menambah pengeluaran:",
      error.message
    );

    return res.status(500).json({

      success: false,

      message:
        "Gagal menyimpan pengeluaran",

    });

  }

};