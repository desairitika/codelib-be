const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for coding Problems
const ProblemSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "easy",
    },
    status: {
      type: String,
      enum: ["solved", "unsolved"],
      default: "unsolved",
    },
    tags: [String],
    category: {
      type: String, 
    },
    solutions: {
      type: Map,
      of: {
        type: Schema.Types.ObjectId,
        ref: "Solution",
      },
      default: {},
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Problem", ProblemSchema);
