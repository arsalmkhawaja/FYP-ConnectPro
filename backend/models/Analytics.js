const mongoose = require("mongoose");
const { Schema } = mongoose;

const analyticsSchema = new Schema({
  campaign: { type: Schema.Types.ObjectId, ref: "Campaign", required: true },
  totalCalls: { type: Number, default: 0 },
  totalSales: { type: Number, default: 0 },
  totalDuration: { type: Number, default: 0 },
  successRate: { type: Number, default: 0 }, // percentage of calls resulting in sales
  targetAchievement: { type: Number, default: 0 }, // percentage of target sales achieved
  agentsPerformance: [
    {
      agent: { type: Schema.Types.ObjectId, ref: "Agent" },
      totalCalls: { type: Number, default: 0 },
      totalSales: { type: Number, default: 0 },
      performance: { type: Number, default: 0 }, // performance score for each agent
    },
  ],
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Analytics", analyticsSchema);
