const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SupportSchema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    message: {
      type: String,
    },
  },
  { collection: "support" },
  { timestamps: true }
);

module.exports = mongoose.model("Support", SupportSchema);
