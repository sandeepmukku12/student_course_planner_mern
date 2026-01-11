const { studySessionService } = require("../services");

// Create session
const createSession = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const session = await studySessionService.addNewStudySession(
      userId,
      req.body
    );

    return res.status(201).json(session);
  } catch (error) {
    next(error);
  }
};

// Get sessions by group
const getSessionsByGroup = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const groupId = req.params.groupId;
    const sessions = await studySessionService.getSessionsByGroupByGroupId(
      userId,
      groupId
    );

    return res.status(200).json(sessions);
  } catch (error) {
    next(error);
  }
};

// Delete session
const deleteSession = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const sessionId = req.params.sessionId;
    await studySessionService.removeStudySessionById(userId, sessionId);

    return res.status(200).json({ msg: "Study session removed successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSession,
  getSessionsByGroup,
  deleteSession,
};
