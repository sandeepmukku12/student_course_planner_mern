const { StudyGroup } = require("../models");

// Get all study groups
const getAllStudyGroups = async (filters) => {
  const query = {};

  /* Full-text search */
  if (filters.search) {
    query.$text = { $search: filters.search };
  }

  /* Filters */
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

  /* Pagination */
  let page = parseInt(filters.page, 10);
  let limit = parseInt(filters.limit, 10);

  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(limit) || limit < 1) limit = 10;

  // Count total documents
  const total = await StudyGroup.countDocuments(query);
  const totalPages = Math.ceil(total / limit);

  // Clamp page to last page
  if (page > totalPages && totalPages > 0) {
    page = totalPages;
  }
    
  // Calculate skip safely
  const skip = (page - 1) * limit;

  /* Sorting */
  let sort = { createdAt: -1 }; //default

  if (filters.sortBy) {
    const order = filters.order === "asc" ? 1 : -1;
    sort = { [filters.sortBy]: order };
  }

  let mongooseQuery = StudyGroup.find(query)
    .populate("course")
    .populate("members", "name email")
    .skip(skip)
    .limit(limit);

  // Apply text score ONLY if search exists
  /* If text search → sort by relevance first */
  if (filters.search) {
    mongooseQuery = mongooseQuery
      .select({ score: { $meta: "textScore" } })
      .sort({ score: { $meta: "textScore" } });
  } else {
    mongooseQuery = mongooseQuery.sort(sort);
  }

  /* Execute queries */
  const groups = await mongooseQuery;

  return {
    data: groups,
    pagination: {
      total,
      page,
      limit,
      totalPages,
    },
  };
};

// Create study group
const addNewStudyGroup = async (userId, studyGroupBody) => {
  const { name, description, course, language, skillLevel } = studyGroupBody;

  const group = new StudyGroup({
    name,
    description,
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
