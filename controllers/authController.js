const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const pool = require("../config/postgres");

// ========================================
// LOGIN
// ========================================

const login = async (req, res) => {
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
            message: "Email dan password wajib diisi"
        });
    }

    try {
        // ========================================
        // NORMALISASI EMAIL
        // ========================================

        const normalizedEmail =
            email.trim().toLowerCase();

        // ========================================
        // CARI USER
        // ========================================

        const result = await pool.query(
            `
            SELECT
                id,
                nama,
                email,
                password,
                role
            FROM users
            WHERE LOWER(email) = $1
            LIMIT 1
            `,
            [normalizedEmail]
        );

        const user = result.rows[0];

        // ========================================
        // USER TIDAK DITEMUKAN
        // ========================================

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Email atau password salah"
            });
        }

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
                message: "Email atau password salah"
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
            message: "Login berhasil",
            token: token,
            user: {
                id: user.id,
                nama: user.nama,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {

        // ========================================
        // ERROR DATABASE / LOGIN
        // ========================================

        console.error(
            "ERROR DATABASE LOGIN:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan database"
        });
    }
};

// ========================================
// EXPORT
// ========================================

module.exports = {
    login
};