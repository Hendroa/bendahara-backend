const express = require("express");

const router = express.Router();

const pemasukanController =
    require("../controllers/pemasukanController");

const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/authMiddleware");


// ========================================
// GET SEMUA PEMASUKAN
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

    pemasukanController.getAllPemasukan

);


// ========================================
// TAMBAH PEMASUKAN
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

    pemasukanController.createPemasukan

);


// ========================================
// GET PEMASUKAN BERDASARKAN ID
// ========================================
//
// KETUA + BENDAHARA
//
// ========================================

router.get(

    "/:id",

    authenticateToken,

    authorizeRoles(
        "ketua",
        "bendahara"
    ),

    pemasukanController.getPemasukanById

);


// ========================================
// UPDATE PEMASUKAN
// ========================================
//
// KETUA + BENDAHARA
//
// ========================================

router.put(

    "/:id",

    authenticateToken,

    authorizeRoles(
        "ketua",
        "bendahara"
    ),

    pemasukanController.updatePemasukan

);


// ========================================
// DELETE PEMASUKAN
// ========================================
//
// KETUA + BENDAHARA
//
// ========================================

router.delete(

    "/:id",

    authenticateToken,

    authorizeRoles(
        "ketua",
        "bendahara"
    ),

    pemasukanController.deletePemasukan

);


// ========================================
// EXPORT
// ========================================

module.exports = router;