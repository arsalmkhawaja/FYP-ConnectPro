const mongoose = require("mongoose");
const { Schema } = mongoose;

const SalesSchema = new Schema({
  agent: { type: Schema.Types.ObjectId, ref: "Agent", required: true },
  form: { type: Schema.Types.ObjectId, required: true, unique: true },
  campaign: { type: Schema.Types.Mixed, required: false },
  amount: { type: Number, required: true },
  saleDate: { type: Date, default: Date.now },
  score: { type: Number, required: false },
  sentiment: { type: String, required: false },
});

module.exports = mongoose.model("Sales", SalesSchema);
