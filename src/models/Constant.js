const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ConstantSchema = new Schema(
  {
    value: {
      type: String,
      required: true,
      unique: true,
    },
    label: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    icon:{
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Constant", ConstantSchema);
