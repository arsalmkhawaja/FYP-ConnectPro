// Call.js

const mongoose = require("mongoose");
const { Schema } = mongoose;

const CallSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: [true, "phoneNumber is required"],
    },
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
      required: true,
    },
    form: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form",
    },
    campaign: { type: Schema.Types.Mixed, required: false },

    duration: {
      type: Number,
      required: [true, "duration is required"],
    },
    sentiment: {
      type: String,
      enum: ["Positive", "Negative", "Neutral"],
      default: "Positive",
    },
    disposition: {
      type: String,
      required: [true, "disposition is required"],
    },
    transcription: {
      type: String,
    },
    recording: {
      type: Buffer, // Storing binary data
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Call", CallSchema);
