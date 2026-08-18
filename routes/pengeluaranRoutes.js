const express = require("express");

const router = express.Router();


const {
  getAllPengeluaran,
  createPengeluaran,
} = require("../controllers/pengeluaranController");


// ========================================
// GET SEMUA PENGELUARAN
// ========================================

router.get(
  "/",
  getAllPengeluaran
);


// ========================================
// TAMBAH PENGELUARAN
// ========================================

router.post(
  "/",
  createPengeluaran
);


module.exports = router;