const express = require("express");

const router = express.Router();

const {
    getAllPengeluaran,
    createPengeluaran,
} = require("../controllers/pengeluaranController");

const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/authMiddleware");


// ========================================
// GET SEMUA PENGELUARAN
// ========================================
//
// KETUA + BENDAHARA + USER
//
// USER HANYA BOLEH MELIHAT DATA
//
// ========================================

router.get(

    "/",

    authenticateToken,

    authorizeRoles(
        "ketua",
        "bendahara",
        "user"
    ),

    getAllPengeluaran

);


// ========================================
// TAMBAH PENGELUARAN
// ========================================
//
// KETUA + BENDAHARA
//
// USER TIDAK BOLEH
//
// ========================================

router.post(

    "/",

    authenticateToken,

    authorizeRoles(
        "ketua",
        "bendahara"
    ),

    createPengeluaran

);


// ========================================
// EXPORT
// ========================================

module.exports = router;