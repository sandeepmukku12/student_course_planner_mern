const express = require("express");
const { courseController } = require("../controllers");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware, courseController.getCourses);

router.post("/", authMiddleware, courseController.createCourse);

module.exports = router;
