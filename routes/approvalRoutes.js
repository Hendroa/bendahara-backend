const express = require("express");

const router = express.Router();

const approvalController = require(
  "../controllers/approvalController"
);

// ============================================================
// GET SEMUA TRANSAKSI PENDING
// ============================================================

router.get(
  "/pending",
  approvalController.getPending
);

// ============================================================
// PEMASUKAN
// ============================================================

router.put(
  "/pemasukan/:id/approve",
  approvalController.approvePemasukan
);

router.put(
  "/pemasukan/:id/reject",
  approvalController.rejectPemasukan
);

// ============================================================
// PENGELUARAN
// ============================================================

router.put(
  "/pengeluaran/:id/approve",
  approvalController.approvePengeluaran
);

router.put(
  "/pengeluaran/:id/reject",
  approvalController.rejectPengeluaran
);

module.exports = router;