const express = require("express");
const authController = require("../controllers/auth.controller");

const router = express.Router();

// Signup
router.post("/signup", authController.signup);

// Login
router.post("/login", authController.login);

module.exports = router;