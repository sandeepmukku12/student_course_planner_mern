const mongoose = require("mongoose");

const studyGroupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    language: { type: String },
    skillLevel: { type: String },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

/* Text index for search */
studyGroupSchema.index({ name: "text", description: "text" });

/* CASCADE DELETE: Automatically remove sessions when a group is deleted */
studyGroupSchema.pre("findOneAndDelete", async function (next) {
  const doc = await this.model.findOne(this.getQuery());
  if (doc) {
    await mongoose.model("StudySession").deleteMany({ group: doc._id });
  }
  next();
});

const StudyGroup = mongoose.model("StudyGroup", studyGroupSchema);
module.exports = { StudyGroup };
