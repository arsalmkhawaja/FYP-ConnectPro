const mongoose = require("mongoose");
const { Schema } = mongoose;

const CallSchema = new Schema({
  phoneNumber: { type: String, required: true },  // Phone number of the call
  form: { type: Schema.Types.ObjectId, ref: "Form", required: false }, // Form can be optional
  agent: { type: Schema.Types.ObjectId, ref: "Agent", required: true }, // Agent handling the call
  campaign: { type: Schema.Types.Mixed, required: false },  // Campaign ID (can be a string or ObjectId)
  duration: { type: Number, required: true },  // Duration of the call
  date: { type: Date, default: Date.now },  // Date of the call
  sentiment: { type: String, required: false },  // Sentiment of the call
  disposition: { type: String, required: true },  // Call disposition (e.g., SALE, NO ANSWER)
  transcription: { type: String, required: false },  // Transcription of the call
});

module.exports = mongoose.model("Call", CallSchema);
