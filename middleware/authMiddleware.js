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
    // AMBIL HEADER
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


    try {

        // ====================================
        // VERIFIKASI TOKEN
        // ====================================

        const decoded =
            jwt.verify(

                token,

                process.env.JWT_SECRET ||
                "bendahara-secret-key"

            );


        // ====================================
        // SIMPAN USER KE REQUEST
        // ====================================

        req.user = decoded;


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
// EXPORT
// ========================================

module.exports = {
    authenticateToken
};