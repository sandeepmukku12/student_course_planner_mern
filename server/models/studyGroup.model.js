const mongoose = require("mongoose");

const studyGroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    language: {
        type: String,
    },
    skillLevel: {
        type: String, // Skill Level - Beginner, Intermediate, Advanced
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
}, { timestamps: true });

const StudyGroup = mongoose.model("StudyGroup", studyGroupSchema);

module.exports = {
    StudyGroup,
};