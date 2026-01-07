const express = require("express");
const { userController } = require("../controllers");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/me", authMiddleware, userController.getProfile);

router.put("/me", authMiddleware, userController.updateProfile);

module.exports = router;
