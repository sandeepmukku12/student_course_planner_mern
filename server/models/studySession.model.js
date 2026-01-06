const mongoose = require("mongoose");

const studySessionSchema = new mongoose.Schema({
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "StudyGroup",
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    topic : {
        type: String,
    },
}, { timestamps: true });

const StudySession = mongoose.model("StudySession", studySessionSchema);

module.exports = {
    StudySession,
};