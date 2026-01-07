const { StudyGroup } = require("../models");

// Get all study groups
const getAllStudyGroups = async (filters) => {
  const query = {};

  // Only add filters if provided
  if (filters.course) {
    query.course = filters.course;
  }

  if (filters.language) {
    query.language = { $regex: new RegExp(filters.language, "i") }; // case-insensitive match
  }

  if (filters.skillLevel) {
    query.skillLevel = filters.skillLevel;
  }

  const groups = await StudyGroup.find(query)
    .populate("course")
    .populate("members", "name email");

  return groups;
};

// Create study group
const addNewStudyGroup = async (userId, studyGroupBody) => {
  const { name, course, language, skillLevel } = studyGroupBody;

  const group = new StudyGroup({
    name,
    course,
    language,
    skillLevel,
    members: [userId],
  });

  await group.save();

  return group;
};

// Join group
const joinGroupById = async (userId, groupId) => {
  const group = await StudyGroup.findById(groupId);

  if (!group) {
    const error = new Error("Study group not found");
    error.statusCode = 404;
    throw error;
  }

  if (group.members.includes(userId)) {
    const error = new Error("Already a member of this group");
    error.statusCode = 400;
    throw error;
  }

  group.members.push(userId);
  await group.save();

  return group;
};

// Leave group
const leaveGroupById = async (userId, groupId) => {
  const group = await StudyGroup.findById(groupId);

  if (!group) {
    const error = new Error("Study group not found");
    error.statusCode = 404;
    throw error;
  }

  if (!group.members.includes(userId)) {
    const error = new Error("You are not a member of this group");
    error.statusCode = 400;
    throw error;
  }

  group.members = group.members.filter((m) => m.toString() !== userId);

  await group.save();

  return group;
};

module.exports = {
  getAllStudyGroups,
  addNewStudyGroup,
  joinGroupById,
  leaveGroupById,
};
