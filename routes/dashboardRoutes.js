const express = require("express");

const router = express.Router();

const dashboardController = require(
  "../controllers/dashboardController"
);

// ========================================
// GET DASHBOARD
// ========================================

router.get(
  "/",
  dashboardController.getDashboard
);

module.exports = router;