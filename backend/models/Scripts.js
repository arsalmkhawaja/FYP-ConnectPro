// models/Script.js
const mongoose = require("mongoose");

const ScriptSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // Ensure script names are unique
    },
    script: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // Optional, tracks createdAt and updatedAt
);

module.exports = mongoose.model("Script", ScriptSchema);
