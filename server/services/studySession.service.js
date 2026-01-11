const { StudySession, StudyGroup } = require("../models");

// Create session
const addNewStudySession = async (userId, studySessionBody) => {
  const { groupId, date, topic, startTime, duration, location } =
    studySessionBody;

  const groupData = await StudyGroup.findById(groupId);

  if (!groupData) {
    const error = new Error("Study group not found");
    error.statusCode = 404;
    throw error;
  }

  // Check membership directly
  if (!groupData.members.includes(userId)) {
    const error = new Error("You must join the group to create sessions");
    error.statusCode = 403;
    throw error;
  }

  const session = new StudySession({
    group: groupId,
    date,
    topic,
    startTime,
    duration,
    location,
    creator: userId,
  });

  await session.save();
  return session;
};

// Get sessions by group
const getSessionsByGroupByGroupId = async (userId, groupId) => {
  const group = await StudyGroup.findById(groupId);

  if (!group) {
    const error = new Error("Study group not found");
    error.statusCode = 404;
    throw error;
  }

  if (!group.members.includes(userId)) {
    const error = new Error(
      "You are not allowed to access the sessions of this group"
    );
    error.statusCode = 403;
    throw error;
  }

  const sessions = await StudySession.find({
    group: groupId,
  }).sort("date");

  return sessions;
};

// Delete session
const removeStudySessionById = async (userId, sessionId) => {
  const session = await StudySession.findById(sessionId);

  if (!session) {
    const error = new Error("Study session not found");
    error.statusCode = 404;
    throw error;
  }

  // Permission Check: Only session creator or group host can delete
  const group = await StudyGroup.findById(session.group);

  const isSessionCreator = session.creator.toString() === userId;
  const isGroupHost = group?.creator.toString() === userId;

  if (!isSessionCreator && !isGroupHost) {
    const error = new Error("Permission denied");
    error.statusCode = 403;
    throw error;
  }

  await StudySession.findByIdAndDelete(sessionId);
  return true;
};

module.exports = {
  addNewStudySession,
  getSessionsByGroupByGroupId,
  removeStudySessionById,
};
