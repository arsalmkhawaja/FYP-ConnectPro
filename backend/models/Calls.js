const mongoose = require("mongoose");
const { Schema } = mongoose;

const CallSchema = new Schema({
  phoneNumber: { type: String, required: true },
  form: { type: Schema.Types.ObjectId, ref: "Form", required: true }, // Refers to the associated form
  agent: { type: Schema.Types.ObjectId, ref: "Agent", required: true }, // Refers to the agent handling the call
  date: { type: Date, default: Date.now }, // The date and time of the call
  duration: { type: Number, required: true }, // Duration of the call in seconds or minutes
  sentiment: { type: String, required: false }, // Sentiment analysis result for the call
  disposition: { type: String, required: true }, // Disposition after the call, such as 'Sale', 'No Sale', etc.
  campaign: { type: Schema.Types.Mixed, required: false }, // Allows storing a string or ObjectId for the campaign
  transcription: { type: String, required: false }, // Text transcription of the call
});

module.exports = mongoose.model("Call", CallSchema);
