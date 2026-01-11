const express = require("express");
const { studySessionController } = require("../controllers");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/", authMiddleware, studySessionController.createSession);

router.get(
  "/:groupId",
  authMiddleware,
  studySessionController.getSessionsByGroup
);

router.delete(
  "/:sessionId",
  authMiddleware,
  studySessionController.deleteSession
);

module.exports = router;
