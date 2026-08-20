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
// KETUA + BENDAHARA
//
// ========================================

router.get(

    "/",

    authenticateToken,

    authorizeRoles(
        "ketua",
        "bendahara"
    ),

    getAllPengeluaran

);


// ========================================
// TAMBAH PENGELUARAN
// ========================================
//
// KETUA + BENDAHARA
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