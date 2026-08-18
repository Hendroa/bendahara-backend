const bcrypt = require("bcryptjs");
const pool = require("../config/postgres");

// ========================================
// HELPER ACTIVITY LOG
// ========================================

const createActivityLog = async (
  userId,
  aktivitas
) => {
  try {
    await pool.query(
      `
        INSERT INTO activity_log
        (
          user_id,
          aktivitas
        )
        VALUES ($1, $2)
      `,
      [
        userId || null,
        aktivitas,
      ]
    );

  } catch (error) {

    console.error(
      "ACTIVITY LOG ERROR:",
      error
    );

    // Activity log tidak boleh membuat
    // proses utama gagal.
  }
};


// ========================================
// GET SEMUA USER
// ========================================

const getAllUsers = async (req, res) => {

  try {

    const result = await pool.query(
      `
        SELECT
          id,
          nama,
          email,
          role
        FROM users
        ORDER BY id ASC
      `
    );

    return res.json({

      success: true,

      data: result.rows,

    });

  } catch (error) {

    console.error(
      "GET USERS ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Gagal mengambil data user",

    });

  }

};


// ========================================
// CREATE USER
// ========================================

const createUser = async (req, res) => {

  try {

    const {
      nama,
      email,
      password,
      role,
    } = req.body;


    // ======================================
    // VALIDASI
    // ======================================

    if (
      !nama ||
      !email ||
      !password ||
      !role
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Nama, email, password, dan role wajib diisi",

      });

    }


    // ======================================
    // CLEAN DATA
    // ======================================

    const namaClean =
      String(nama).trim();

    const emailClean =
      String(email)
        .trim()
        .toLowerCase();

    const roleClean =
      String(role)
        .trim()
        .toLowerCase();


    // ======================================
    // VALIDASI ROLE
    // ======================================

    const allowedRoles = [
      "ketua",
      "bendahara",
      "user",
    ];


    if (
      !allowedRoles.includes(roleClean)
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Role tidak valid",

      });

    }


    // ======================================
    // VALIDASI PASSWORD
    // ======================================

    if (
      String(password).length < 6
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Password minimal 6 karakter",

      });

    }


    // ======================================
    // CEK EMAIL
    // ======================================

    const existingUserResult =
      await pool.query(
        `
          SELECT
            id
          FROM users
          WHERE LOWER(email) = LOWER($1)
          LIMIT 1
        `,
        [
          emailClean,
        ]
      );


    if (
      existingUserResult.rows.length > 0
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Email sudah digunakan",

      });

    }


    // ======================================
    // HASH PASSWORD
    // ======================================

    let hashedPassword;

    try {

      hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

    } catch (hashError) {

      console.error(
        "HASH PASSWORD ERROR:",
        hashError
      );

      return res.status(500).json({

        success: false,

        message:
          "Gagal mengenkripsi password",

      });

    }


    // ======================================
    // INSERT USER
    // ======================================

    const insertResult =
      await pool.query(
        `
          INSERT INTO users
          (
            nama,
            email,
            password,
            role
          )
          VALUES
          (
            $1,
            $2,
            $3,
            $4
          )
          RETURNING
            id,
            nama,
            email,
            role
        `,
        [
          namaClean,
          emailClean,
          hashedPassword,
          roleClean,
        ]
      );


    const newUser =
      insertResult.rows[0];


    // ======================================
    // ACTIVITY LOG
    // ======================================

    await createActivityLog(
      req.user?.id || null,
      `Menambahkan user: ${namaClean} (${emailClean}) dengan role ${roleClean}`
    );


    // ======================================
    // RESPONSE
    // ======================================

    return res.status(201).json({

      success: true,

      message:
        "User berhasil dibuat",

      data: {

        id: newUser.id,

        nama: newUser.nama,

        email: newUser.email,

        role: newUser.role,

      },

    });

  } catch (error) {

    console.error(
      "CREATE USER EXCEPTION:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Terjadi kesalahan pada server",

    });

  }

};


// ========================================
// UPDATE USER
// ========================================

const updateUser = async (req, res) => {

  try {

    const {
      id,
    } = req.params;


    const {
      nama,
      email,
      password,
      role,
    } = req.body;


    // ======================================
    // VALIDASI
    // ======================================

    if (
      !nama ||
      !email ||
      !role
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Nama, email, dan role wajib diisi",

      });

    }


    // ======================================
    // CLEAN DATA
    // ======================================

    const namaClean =
      String(nama).trim();

    const emailClean =
      String(email)
        .trim()
        .toLowerCase();

    const roleClean =
      String(role)
        .trim()
        .toLowerCase();


    // ======================================
    // VALIDASI ROLE
    // ======================================

    const allowedRoles = [
      "ketua",
      "bendahara",
      "user",
    ];


    if (
      !allowedRoles.includes(roleClean)
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Role tidak valid",

      });

    }


    // ======================================
    // CEK USER
    // ======================================

    const userResult =
      await pool.query(
        `
          SELECT
            id,
            nama,
            email,
            role
          FROM users
          WHERE id = $1
          LIMIT 1
        `,
        [
          id,
        ]
      );


    const user =
      userResult.rows[0];


    if (!user) {

      return res.status(404).json({

        success: false,

        message:
          "User tidak ditemukan",

      });

    }


    // ======================================
    // CEK EMAIL DUPLIKAT
    // ======================================

    const existingUserResult =
      await pool.query(
        `
          SELECT
            id
          FROM users
          WHERE LOWER(email) = LOWER($1)
          AND id != $2
          LIMIT 1
        `,
        [
          emailClean,
          id,
        ]
      );


    if (
      existingUserResult.rows.length > 0
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Email sudah digunakan",

      });

    }


    // ======================================
    // UPDATE TANPA PASSWORD
    // ======================================

    if (
      !password ||
      String(password).trim() === ""
    ) {

      const updateResult =
        await pool.query(
          `
            UPDATE users
            SET
              nama = $1,
              email = $2,
              role = $3
            WHERE id = $4
            RETURNING
              id,
              nama,
              email,
              role
          `,
          [
            namaClean,
            emailClean,
            roleClean,
            id,
          ]
        );


      const updatedUser =
        updateResult.rows[0];


      // ==================================
      // ACTIVITY LOG
      // ==================================

      await createActivityLog(
        req.user?.id || null,
        `Mengubah user: ${user.nama} menjadi ${namaClean} (${emailClean}) dengan role ${roleClean}`
      );


      // ==================================
      // RESPONSE
      // ==================================

      return res.json({

        success: true,

        message:
          "User berhasil diperbarui",

        data: {

          id: updatedUser.id,

          nama: updatedUser.nama,

          email: updatedUser.email,

          role: updatedUser.role,

        },

      });

    }


    // ======================================
    // VALIDASI PASSWORD BARU
    // ======================================

    if (
      String(password).length < 6
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Password minimal 6 karakter",

      });

    }


    // ======================================
    // HASH PASSWORD BARU
    // ======================================

    let hashedPassword;

    try {

      hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

    } catch (hashError) {

      console.error(
        "HASH UPDATE PASSWORD ERROR:",
        hashError
      );

      return res.status(500).json({

        success: false,

        message:
          "Gagal mengenkripsi password",

      });

    }


    // ======================================
    // UPDATE DENGAN PASSWORD
    // ======================================

    const updateResult =
      await pool.query(
        `
          UPDATE users
          SET
            nama = $1,
            email = $2,
            password = $3,
            role = $4
          WHERE id = $5
          RETURNING
            id,
            nama,
            email,
            role
        `,
        [
          namaClean,
          emailClean,
          hashedPassword,
          roleClean,
          id,
        ]
      );


    const updatedUser =
      updateResult.rows[0];


    // ======================================
    // ACTIVITY LOG
    // ======================================

    await createActivityLog(
      req.user?.id || null,
      `Mengubah user dan password: ${user.nama} menjadi ${namaClean} (${emailClean}) dengan role ${roleClean}`
    );


    // ======================================
    // RESPONSE
    // ======================================

    return res.json({

      success: true,

      message:
        "User berhasil diperbarui",

      data: {

        id: updatedUser.id,

        nama: updatedUser.nama,

        email: updatedUser.email,

        role: updatedUser.role,

      },

    });

  } catch (error) {

    console.error(
      "UPDATE USER EXCEPTION:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Terjadi kesalahan pada server",

    });

  }

};


// ========================================
// DELETE USER
// ========================================

const deleteUser = async (req, res) => {

  try {

    const {
      id,
    } = req.params;


    // ======================================
    // VALIDASI
    // ======================================

    if (!id) {

      return res.status(400).json({

        success: false,

        message:
          "ID user wajib diisi",

      });

    }


    // ======================================
    // CEK USER
    // ======================================

    const userResult =
      await pool.query(
        `
          SELECT
            id,
            nama,
            email,
            role
          FROM users
          WHERE id = $1
          LIMIT 1
        `,
        [
          id,
        ]
      );


    const user =
      userResult.rows[0];


    if (!user) {

      return res.status(404).json({

        success: false,

        message:
          "User tidak ditemukan",

      });

    }


    // ======================================
    // HAPUS USER
    // ======================================

    const deleteResult =
      await pool.query(
        `
          DELETE FROM users
          WHERE id = $1
          RETURNING
            id,
            nama,
            email,
            role
        `,
        [
          id,
        ]
      );


    if (
      deleteResult.rows.length === 0
    ) {

      return res.status(404).json({

        success: false,

        message:
          "User tidak berhasil dihapus",

      });

    }


    // ======================================
    // ACTIVITY LOG
    // ========================================

    await createActivityLog(
      req.user?.id || null,
      `Menghapus user: ${user.nama} (${user.email}) dengan role ${user.role}`
    );


    // ======================================
    // RESPONSE
    // ======================================

    return res.json({

      success: true,

      message:
        "User berhasil dihapus",

      data: {

        id: Number(user.id),

        nama: user.nama,

        email: user.email,

        role: user.role,

      },

    });

  } catch (error) {

    console.error(
      "DELETE USER ERROR:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Gagal menghapus user",

    });

  }

};


// ========================================
// EXPORT
// ========================================

module.exports = {

  getAllUsers,

  createUser,

  updateUser,

  deleteUser,

};