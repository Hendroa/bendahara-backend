const express = require("express");

const router = express.Router();

const dashboardController =
    require("../controllers/dashboardController");

const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/authMiddleware");


// ========================================
// GET DASHBOARD
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

    dashboardController.getDashboard

);


// ========================================
// EXPORT
// ========================================

module.exports = router;