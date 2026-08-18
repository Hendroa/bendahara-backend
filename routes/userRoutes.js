const express = require("express");

const router = express.Router();

const userController =
    require("../controllers/userController");

const {
    authenticateToken
} = require("../middleware/authMiddleware");


// ========================================
// GET SEMUA USER
// ========================================

router.get(
    "/",
    authenticateToken,
    userController.getAllUsers
);


// ========================================
// TAMBAH USER
// ========================================

router.post(
    "/",
    authenticateToken,
    userController.createUser
);


// ========================================
// UPDATE USER
// ========================================

router.put(
    "/:id",
    authenticateToken,
    userController.updateUser
);


// ========================================
// DELETE USER
// ========================================

router.delete(
    "/:id",
    authenticateToken,
    userController.deleteUser
);


// ========================================
// EXPORT
// ========================================

module.exports = router;