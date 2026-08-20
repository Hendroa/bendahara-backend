const express = require("express");

const router = express.Router();

const approvalController = require(
    "../controllers/approvalController"
);

const {
    authenticateToken,
    authorizeRoles
} = require(
    "../middleware/authMiddleware"
);


// ============================================================
// GET SEMUA TRANSAKSI PENDING
// ============================================================
//
// HANYA KETUA
//
// ============================================================

router.get(

    "/pending",

    authenticateToken,

    authorizeRoles("ketua"),

    approvalController.getPending

);


// ============================================================
// APPROVE PEMASUKAN
// ============================================================
//
// HANYA KETUA
//
// ============================================================

router.put(

    "/pemasukan/:id/approve",

    authenticateToken,

    authorizeRoles("ketua"),

    approvalController.approvePemasukan

);


// ============================================================
// REJECT PEMASUKAN
// ============================================================
//
// HANYA KETUA
//
// ============================================================

router.put(

    "/pemasukan/:id/reject",

    authenticateToken,

    authorizeRoles("ketua"),

    approvalController.rejectPemasukan

);


// ============================================================
// APPROVE PENGELUARAN
// ============================================================
//
// HANYA KETUA
//
// ============================================================

router.put(

    "/pengeluaran/:id/approve",

    authenticateToken,

    authorizeRoles("ketua"),

    approvalController.approvePengeluaran

);


// ============================================================
// REJECT PENGELUARAN
// ============================================================
//
// HANYA KETUA
//
// ============================================================

router.put(

    "/pengeluaran/:id/reject",

    authenticateToken,

    authorizeRoles("ketua"),

    approvalController.rejectPengeluaran

);


// ============================================================
// EXPORT
// ============================================================

module.exports = router;