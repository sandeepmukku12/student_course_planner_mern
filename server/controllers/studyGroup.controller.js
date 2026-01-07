const { studyGroupService } = require("../services");

// Get all study groups
const getStudyGroups = async (req, res) => {
    try {
        const groups = await studyGroupService.getAllStudyGroups();

        return res.status(200).json(groups);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Server error" });
    }
};

// Create study group
const createStudyGroup = async (req, res) => {
    try {
        const userId = req.user.id;
        const group = await studyGroupService.addNewStudyGroup(userId, req.body);

        return res.status(201).json(group);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Server error" });
    }
};

// Join group
const joinGroup = async (req, res) => {
    try {
        const userId = req.user.id;
        const groupId = req.params.id;

        const group = await studyGroupService.joinGroupById(userId, groupId);

        return res.status(200).json(group);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Server error" });
    }
};

// Leave group
const leaveGroup = async (req, res) => {
    try {
        const userId = req.user.id;
        const groupId = req.params.id;

        const group = await studyGroupService.leaveGroupById(userId, groupId);

        return res.status(200).json(group);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Server error" });
    }
};


module.exports = {
    getStudyGroups,
    createStudyGroup,
    joinGroup,
    leaveGroup,
};