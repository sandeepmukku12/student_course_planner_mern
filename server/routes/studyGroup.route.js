const express = require("express");
const { studyGroupController } = require("../controllers");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware, studyGroupController.getStudyGroups);

router.post("/", authMiddleware, studyGroupController.createStudyGroup);

router.put("/:id/join", authMiddleware, studyGroupController.joinGroup);

router.put("/:id/leave", authMiddleware, studyGroupController.leaveGroup);

module.exports = router;
