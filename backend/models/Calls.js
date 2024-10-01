const mongoose = require("mongoose");
const { Schema } = mongoose;

const CallSchema = new Schema({
  phoneNumber: { type: String, required: true },
  form: { type: Schema.Types.ObjectId, ref: "Form", required: false },
  agent: { type: Schema.Types.ObjectId, ref: "Agent", required: true },
  campaign: { type: Schema.Types.Mixed, required: false },
  duration: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  sentiment: { type: String, required: false },
  disposition: { type: String, required: true },
  transcription: { type: String, required: false },
});

module.exports = mongoose.model("Call", CallSchema);
