const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const db = require("../config/db");


// ========================================
// LOGIN
// ========================================

const login = (req, res) => {

    const {
        email,
        password
    } = req.body;


    // ========================================
    // VALIDASI
    // ========================================

    if (!email || !password) {

        return res.status(400).json({

            success: false,

            message:
                "Email dan password wajib diisi"

        });

    }


    // ========================================
    // CARI USER
    // ========================================

    const sql = `
        SELECT
            id,
            nama,
            email,
            password,
            role
        FROM users
        WHERE email = ?
    `;


    db.get(
        sql,
        [email.trim().toLowerCase()],
        async (err, user) => {

            // ========================================
            // ERROR DATABASE
            // ========================================

            if (err) {

                console.error(
                    "ERROR DATABASE LOGIN:",
                    err
                );

                return res.status(500).json({

                    success: false,

                    message:
                        "Terjadi kesalahan database"

                });

            }


            // ========================================
            // USER TIDAK DITEMUKAN
            // ========================================

            if (!user) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Email atau password salah"

                });

            }


            try {

                // ========================================
                // CEK PASSWORD
                // ========================================

                const passwordMatch =
                    await bcrypt.compare(
                        password,
                        user.password
                    );


                // ========================================
                // PASSWORD SALAH
                // ========================================

                if (!passwordMatch) {

                    return res.status(401).json({

                        success: false,

                        message:
                            "Email atau password salah"

                    });

                }


                // ========================================
                // JWT SECRET
                // ========================================

                const jwtSecret =
                    process.env.JWT_SECRET ||
                    "bendahara-secret-key";


                // ========================================
                // BUAT TOKEN
                // ========================================

                const token =
                    jwt.sign(

                        {
                            id: user.id,
                            nama: user.nama,
                            email: user.email,
                            role: user.role
                        },

                        jwtSecret,

                        {
                            expiresIn: "8h"
                        }

                    );


                // ========================================
                // LOGIN BERHASIL
                // ========================================

                return res.status(200).json({

                    success: true,

                    message:
                        "Login berhasil",

                    token: token,

                    user: {

                        id: user.id,

                        nama: user.nama,

                        email: user.email,

                        role: user.role

                    }

                });

            }

            catch (error) {

                console.error(
                    "ERROR LOGIN:",
                    error
                );

                return res.status(500).json({

                    success: false,

                    message:
                        "Gagal memproses login"

                });

            }

        }
    );

};


// ========================================
// EXPORT
// ========================================

module.exports = {
    login
};