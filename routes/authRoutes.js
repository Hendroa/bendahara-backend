const express = require("express");

const router = express.Router();

router.get("/test", (req, res) => {
    res.json({
        succes: true,
        message: "AUTH ROUTE BERHASIL"
        
    });
});

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