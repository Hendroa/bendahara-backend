const express = require("express");

const router = express.Router();

const pemasukanController = require("../controllers/pemasukanController");


// ========================================
// GET SEMUA PEMASUKAN
// ========================================

router.get(
  "/",
  pemasukanController.getAllPemasukan
);


// ========================================
// TAMBAH PEMASUKAN
// ========================================

router.post(
  "/",
  pemasukanController.createPemasukan
);


// ========================================
// EXPORT ROUTER
// ========================================

module.exports = router;