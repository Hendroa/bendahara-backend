const bcrypt = require("bcryptjs");
const db = require("../config/db");


// ========================================
// HELPER ACTIVITY LOG
// ========================================

const createActivityLog = (
  userId,
  aktivitas
) => {

  return new Promise((resolve, reject) => {

    db.run(
      `
        INSERT INTO activity_log
        (
          user_id,
          aktivitas
        )
        VALUES (?, ?)
      `,
      [
        userId || null,
        aktivitas,
      ],
      (err) => {

        if (err) {

          console.error(
            "ACTIVITY LOG ERROR:",
            err
          );

          reject(err);

          return;
        }

        resolve();

      }
    );

  });

};


// ========================================
// GET SEMUA USER
// ========================================

const getAllUsers = (req, res) => {

  db.all(
    `
      SELECT
        id,
        nama,
        email,
        role
      FROM users
      ORDER BY id ASC
    `,
    [],
    (err, rows) => {

      if (err) {

        console.error(
          "GET USERS ERROR:",
          err
        );

        return res.status(500).json({

          success: false,

          message:
            "Gagal mengambil data user",

        });

      }


      return res.json({

        success: true,

        data: rows,

      });

    }
  );

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

    db.get(
      `
        SELECT id
        FROM users
        WHERE email = ?
      `,
      [emailClean],
      async (
        err,
        existingUser
      ) => {

        if (err) {

          console.error(
            "CHECK EMAIL ERROR:",
            err
          );

          return res.status(500).json({

            success: false,

            message:
              "Gagal memeriksa email",

          });

        }


        if (existingUser) {

          return res.status(400).json({

            success: false,

            message:
              "Email sudah digunakan",

          });

        }


        // ==================================
        // HASH PASSWORD
        // ==================================

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


        // ==================================
        // INSERT USER
        // ==================================

        db.run(
          `
            INSERT INTO users
            (
              nama,
              email,
              password,
              role
            )
            VALUES (?, ?, ?, ?)
          `,
          [
            namaClean,
            emailClean,
            hashedPassword,
            roleClean,
          ],
          async function (insertError) {

            if (insertError) {

              console.error(
                "CREATE USER ERROR:",
                insertError
              );

              return res.status(500).json({

                success: false,

                message:
                  "Gagal membuat user",

              });

            }


            const newUserId =
              this.lastID;


            // =================================
            // ACTIVITY LOG
            // =================================

            try {

              await createActivityLog(
                req.user?.id || null,
                `Menambahkan user: ${namaClean} (${emailClean}) dengan role ${roleClean}`
              );

            } catch (logError) {

              console.error(
                "CREATE LOG ERROR:",
                logError
              );

            }


            // =================================
            // RESPONSE
            // =================================

            return res.status(201).json({

              success: true,

              message:
                "User berhasil dibuat",

              data: {

                id: newUserId,

                nama: namaClean,

                email: emailClean,

                role: roleClean,

              },

            });

          }
        );

      }
    );

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

    db.get(
      `
        SELECT
          id,
          nama,
          email,
          role
        FROM users
        WHERE id = ?
      `,
      [id],
      async (
        err,
        user
      ) => {

        if (err) {

          console.error(
            "GET USER ERROR:",
            err
          );

          return res.status(500).json({

            success: false,

            message:
              "Gagal mengambil user",

          });

        }


        if (!user) {

          return res.status(404).json({

            success: false,

            message:
              "User tidak ditemukan",

          });

        }


        // ==================================
        // CEK EMAIL DUPLIKAT
        // ==================================

        db.get(
          `
            SELECT id
            FROM users
            WHERE email = ?
            AND id != ?
          `,
          [
            emailClean,
            id,
          ],
          async (
            emailError,
            existingUser
          ) => {

            if (emailError) {

              console.error(
                "CHECK UPDATE EMAIL ERROR:",
                emailError
              );

              return res.status(500).json({

                success: false,

                message:
                  "Gagal memeriksa email",

              });

            }


            if (existingUser) {

              return res.status(400).json({

                success: false,

                message:
                  "Email sudah digunakan",

              });

            }


            // =================================
            // UPDATE TANPA PASSWORD
            // =================================

            if (
              !password ||
              String(password).trim() === ""
            ) {

              db.run(
                `
                  UPDATE users
                  SET
                    nama = ?,
                    email = ?,
                    role = ?
                  WHERE id = ?
                `,
                [
                  namaClean,
                  emailClean,
                  roleClean,
                  id,
                ],
                async function (updateError) {

                  if (updateError) {

                    console.error(
                      "UPDATE USER ERROR:",
                      updateError
                    );

                    return res.status(500).json({

                      success: false,

                      message:
                        "Gagal memperbarui user",

                    });

                  }


                  // =========================
                  // ACTIVITY LOG
                  // =========================

                  try {

                    await createActivityLog(
                      req.user?.id || null,
                      `Mengubah user: ${user.nama} menjadi ${namaClean} (${emailClean}) dengan role ${roleClean}`
                    );

                  } catch (logError) {

                    console.error(
                      "UPDATE LOG ERROR:",
                      logError
                    );

                  }


                  return res.json({

                    success: true,

                    message:
                      "User berhasil diperbarui",

                    data: {

                      id: Number(id),

                      nama: namaClean,

                      email: emailClean,

                      role: roleClean,

                    },

                  });

                }
              );


              return;

            }


            // =================================
            // VALIDASI PASSWORD BARU
            // =================================

            if (
              String(password).length < 6
            ) {

              return res.status(400).json({

                success: false,

                message:
                  "Password minimal 6 karakter",

              });

            }


            // =================================
            // HASH PASSWORD
            // =================================

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


            // =================================
            // UPDATE DENGAN PASSWORD
            // =================================

            db.run(
              `
                UPDATE users
                SET
                  nama = ?,
                  email = ?,
                  password = ?,
                  role = ?
                WHERE id = ?
              `,
              [
                namaClean,
                emailClean,
                hashedPassword,
                roleClean,
                id,
              ],
              async function (updateError) {

                if (updateError) {

                  console.error(
                    "UPDATE USER PASSWORD ERROR:",
                    updateError
                  );

                  return res.status(500).json({

                    success: false,

                    message:
                      "Gagal memperbarui user",

                  });

                }


                // =========================
                // ACTIVITY LOG
                // =========================

                try {

                  await createActivityLog(
                    req.user?.id || null,
                    `Mengubah user dan password: ${user.nama} menjadi ${namaClean} (${emailClean}) dengan role ${roleClean}`
                  );

                } catch (logError) {

                  console.error(
                    "UPDATE PASSWORD LOG ERROR:",
                    logError
                  );

                }


                return res.json({

                  success: true,

                  message:
                    "User berhasil diperbarui",

                  data: {

                    id: Number(id),

                    nama: namaClean,

                    email: emailClean,

                    role: roleClean,

                  },

                });

              }
            );

          }
        );

      }
    );

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

const deleteUser = (req, res) => {

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

  db.get(
    `
      SELECT
        id,
        nama,
        email,
        role
      FROM users
      WHERE id = ?
    `,
    [id],
    (err, user) => {

      if (err) {

        console.error(
          "GET USER DELETE ERROR:",
          err
        );

        return res.status(500).json({

          success: false,

          message:
            "Gagal mengambil data user",

        });

      }


      if (!user) {

        return res.status(404).json({

          success: false,

          message:
            "User tidak ditemukan",

        });

      }


      // ==================================
      // HAPUS USER
      // ==================================

      db.run(
        `
          DELETE FROM users
          WHERE id = ?
        `,
        [id],
        async function (deleteError) {

          if (deleteError) {

            console.error(
              "DELETE USER ERROR:",
              deleteError
            );

            return res.status(500).json({

              success: false,

              message:
                "Gagal menghapus user",

            });

          }


          if (
            this.changes === 0
          ) {

            return res.status(404).json({

              success: false,

              message:
                "User tidak berhasil dihapus",

            });

          }


          // =================================
          // ACTIVITY LOG
          // =================================

          try {

            await createActivityLog(
              req.user?.id || null,
              `Menghapus user: ${user.nama} (${user.email}) dengan role ${user.role}`
            );

          } catch (logError) {

            console.error(
              "DELETE LOG ERROR:",
              logError
            );

          }


          // =================================
          // RESPONSE
          // =================================

          return res.json({

            success: true,

            message:
              "User berhasil dihapus",

            data: {

              id: Number(id),

              nama: user.nama,

              email: user.email,

              role: user.role,

            },

          });

        }
      );

    }
  );

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