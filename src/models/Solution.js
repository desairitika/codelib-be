const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SolutionSchema = new Schema(
  {
    problem: {
      type: Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      enum: ["JAVASCRIPT","JAVA","PYTHON"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Solution", SolutionSchema);
