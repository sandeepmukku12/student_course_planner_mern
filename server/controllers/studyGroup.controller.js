const { studyGroupService } = require("../services");

// Get all study groups
const getStudyGroups = async (req, res, next) => {
    try {
        const filters = req.query; // course, language, skillLevel
        const result = await studyGroupService.getAllStudyGroups(filters);

        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

// Create study group
const createStudyGroup = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const group = await studyGroupService.addNewStudyGroup(userId, req.body);

        return res.status(201).json(group);
    } catch (error) {
        next(error);
    }
};

// Join group
const joinGroup = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const groupId = req.params.id;

        const group = await studyGroupService.joinGroupById(userId, groupId);

        return res.status(200).json(group);
    } catch (error) {
        next(error);
    }
};

// Leave group
const leaveGroup = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const groupId = req.params.id;

        const group = await studyGroupService.leaveGroupById(userId, groupId);

        return res.status(200).json(group);
    } catch (error) {
        next(error);
    }
};


module.exports = {
    getStudyGroups,
    createStudyGroup,
    joinGroup,
    leaveGroup,
};