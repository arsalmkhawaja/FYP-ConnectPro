const mongoose = require("mongoose");
const { Schema } = mongoose;

const SalesSchema = new Schema({
  agent: { type: Schema.Types.ObjectId, ref: "Agent", required: true },
  form: { type: Schema.Types.ObjectId, required: true }, // Allows storing the entire form object
  campaign: { type: Schema.Types.Mixed, required: false }, // Allows storing a string or ObjectId
  amount: { type: Number, required: true },
  saleDate: { type: Date, default: Date.now },
  score: { type: Number, required: false },
  sentiment: { type: String, required: false },
});

module.exports = mongoose.model("Sales", SalesSchema);
