const express = require("express");

const router = express.Router();

const userController =
    require("../controllers/userController");

const {
    authenticateToken,
    authorizeRoles
} = require("../middleware/authMiddleware");


// ========================================
// GET SEMUA USER
// ========================================
//
// HANYA KETUA
//
// ========================================

router.get(

    "/",

    authenticateToken,

    authorizeRoles("ketua"),

    userController.getAllUsers

);


// ========================================
// TAMBAH USER
// ========================================
//
// HANYA KETUA
//
// ========================================

router.post(

    "/",

    authenticateToken,

    authorizeRoles("ketua"),

    userController.createUser

);


// ========================================
// UPDATE USER
// ========================================
//
// HANYA KETUA
//
// ========================================

router.put(

    "/:id",

    authenticateToken,

    authorizeRoles("ketua"),

    userController.updateUser

);


// ========================================
// DELETE USER
// ========================================
//
// HANYA KETUA
//
// ========================================

router.delete(

    "/:id",

    authenticateToken,

    authorizeRoles("ketua"),

    userController.deleteUser

);


// ========================================
// EXPORT
// ========================================

module.exports = router;