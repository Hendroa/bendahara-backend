const express = require("express");

const router = express.Router();

const laporanController =
require("../controllers/laporanController");

const {
authenticateToken,
authorizeRoles
} = require("../middleware/authMiddleware");

// ========================================
// GET LAPORAN
// ========================================
//
// KETUA + BENDAHARA + USER
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

laporanController.getLaporan

);

// ========================================
// EXPORT ROUTER
// ========================================

module.exports = router;