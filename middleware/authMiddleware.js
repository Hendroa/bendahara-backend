const jwt = require("jsonwebtoken");


// ========================================
// AUTHENTICATION MIDDLEWARE
// ========================================

const authenticateToken = (
    req,
    res,
    next
) => {

    // ======================================
    // AMBIL HEADER AUTHORIZATION
    // ======================================

    const authHeader =
        req.headers.authorization;


    // ======================================
    // CEK TOKEN
    // ======================================

    if (
        !authHeader ||
        !authHeader.startsWith("Bearer ")
    ) {

        return res.status(401).json({

            success: false,

            message:
                "Token autentikasi tidak ditemukan"

        });

    }


    // ======================================
    // AMBIL TOKEN
    // ======================================

    const token =
        authHeader.split(" ")[1];


    // ======================================
    // CEK TOKEN KOSONG
    // ======================================

    if (!token) {

        return res.status(401).json({

            success: false,

            message:
                "Token autentikasi tidak valid"

        });

    }


    try {

        // ====================================
        // JWT SECRET
        // ====================================

        const jwtSecret =
            process.env.JWT_SECRET ||
            "bendahara-secret-key";


        // ====================================
        // VERIFIKASI TOKEN
        // ====================================

        const decoded =
            jwt.verify(
                token,
                jwtSecret
            );


        // ====================================
        // SIMPAN USER KE REQUEST
        // ====================================

        req.user = decoded;


        // ====================================
        // NORMALISASI ROLE
        // ====================================

        req.user.role =
            String(decoded.role || "")
                .trim()
                .toLowerCase();


        // ====================================
        // DEBUG
        // ====================================

        console.log(
            "AUTH USER:",
            {
                id: req.user.id,
                nama: req.user.nama,
                email: req.user.email,
                role: req.user.role
            }
        );


        // ====================================
        // LANJUTKAN REQUEST
        // ====================================

        next();

    }

    catch (error) {

        console.error(
            "JWT ERROR:",
            error.message
        );


        return res.status(401).json({

            success: false,

            message:
                "Token tidak valid atau sudah kedaluwarsa"

        });

    }

};


// ========================================
// AUTHORIZATION MIDDLEWARE
// ========================================
//
// Contoh:
//
// authorizeRoles("ketua")
//
// authorizeRoles(
//     "ketua",
//     "bendahara"
// )
//
// ========================================

const authorizeRoles = (...allowedRoles) => {

    return (req, res, next) => {

        // ==================================
        // USER BELUM DIAUTHENTIKASI
        // ==================================

        if (!req.user) {

            return res.status(401).json({

                success: false,

                message:
                    "User belum terautentikasi"

            });

        }


        // ==================================
        // ROLE USER
        // ==================================

        const userRole =
            String(req.user.role || "")
                .trim()
                .toLowerCase();


        // ==================================
        // NORMALISASI ROLE YANG DIIZINKAN
        // ==================================

        const normalizedAllowedRoles =
            allowedRoles.map(
                (role) =>
                    String(role)
                        .trim()
                        .toLowerCase()
            );


        // ==================================
        // CEK ROLE
        // ==================================

        if (
            !normalizedAllowedRoles.includes(
                userRole
            )
        ) {

            console.warn(
                "AKSES DITOLAK:",
                {
                    user: req.user.email,
                    role: userRole,
                    allowedRoles:
                        normalizedAllowedRoles
                }
            );


            return res.status(403).json({

                success: false,

                message:
                    "Anda tidak memiliki izin untuk mengakses fitur ini"

            });

        }


        // ==================================
        // AKSES DIIZINKAN
        // ==================================

        next();

    };

};


// ========================================
// EXPORT
// ========================================

module.exports = {

    authenticateToken,

    authorizeRoles

};