const express = require("express");

const router = express.Router();

const {
    login
} = require("../controllers/authController");


// ========================================
// LOGIN
// ========================================

router.post(
    "/login",
    login
);


// ========================================
// EXPORT
// ========================================

module.exports = router;