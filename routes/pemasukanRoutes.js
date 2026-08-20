const express = require("express");

const router = express.Router();

const pemasukanController = require("../controllers/pemasukanController");

const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/authMiddleware");


// ============================================================
// GET SEMUA PEMASUKAN
// KETUA + BENDAHARA + USER
// USER HANYA BOLEH MELIHAT
// ============================================================

router.get(
    "/",
    authenticateToken,
    authorizeRoles(
        "ketua",
        "bendahara",
        "user"
    ),
    pemasukanController.getAllPemasukan
);


// ============================================================
// TAMBAH PEMASUKAN
// KETUA + BENDAHARA
// USER TIDAK BOLEH
// ============================================================

router.post(
    "/",
    authenticateToken,
    authorizeRoles(
        "ketua",
        "bendahara"
    ),
    pemasukanController.createPemasukan
);


// ============================================================
// GET PEMASUKAN BERDASARKAN ID
// KETUA + BENDAHARA + USER
// USER HANYA BOLEH MELIHAT
// ============================================================

router.get(
    "/:id",
    authenticateToken,
    authorizeRoles(
        "ketua",
        "bendahara",
        "user"
    ),
    pemasukanController.getPemasukanById
);


// ============================================================
// UPDATE PEMASUKAN
// KETUA + BENDAHARA
// USER TIDAK BOLEH
// ============================================================

router.put(
    "/:id",
    authenticateToken,
    authorizeRoles(
        "ketua",
        "bendahara"
    ),
    pemasukanController.updatePemasukan
);


// ============================================================
// DELETE PEMASUKAN
// KETUA + BENDAHARA
// USER TIDAK BOLEH
// ============================================================

router.delete(
    "/:id",
    authenticateToken,
    authorizeRoles(
        "ketua",
        "bendahara"
    ),
    pemasukanController.deletePemasukan
);


// ============================================================
// EXPORT
// ============================================================

module.exports = router;