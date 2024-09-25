const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  numberOfAgents: { type: Number, default: 0 },
  agents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Agent" }], // Updated ref to "Agent"
  sales: { type: Number, default: 0 },
  targetSales: { type: Number, default: 0 },
});

const Campaign = mongoose.model("Campaign", campaignSchema);
module.exports = Campaign;
