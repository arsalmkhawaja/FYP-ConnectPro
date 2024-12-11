const Agent = require("../models/Agents");
const Call = require("../models/Calls");
const Campaign = require("../models/Campaigns");

// Utility to calculate average
const calculateAverage = (values) => {
  if (!values.length) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
};

const getAnalyticsData = async (req, res) => {
  try {
    const { agentId } = req.params;

    let agentFilter = {};
    if (agentId !== "overall") {
      agentFilter = { agent: agentId };
    }

    const attendanceData = await Call.aggregate([
      { $match: agentFilter },
      {
        $group: {
          _id: { month: { $month: "$date" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.month": 1 } },
    ]);

    const salesData = await Campaign.aggregate([
      {
        $project: {
          name: 1,
          sales: 1,
          targetSales: 1,
        },
      },
    ]);

    const callDisposition = await Call.aggregate([
      { $match: agentFilter },
      {
        $group: {
          _id: "$disposition",
          count: { $sum: 1 },
        },
      },
    ]);

    const agentWorkingHours = await Call.aggregate([
      { $match: agentFilter },
      {
        $group: {
          _id: "$agent",
          totalDuration: { $sum: "$duration" },
        },
      },
    ]);

    const campaignsSuccess = await Campaign.aggregate([
      {
        $project: {
          name: 1,
          successRate: {
            $multiply: [
              { $divide: ["$sales", { $ifNull: ["$targetSales", 1] }] },
              100,
            ],
          },
        },
      },
    ]);

    res.status(200).json({
      attendanceData,
      salesData,
      callDisposition,
      workingHours: agentWorkingHours,
      campaignsSuccess,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving analytics data", error: err.message });
  }
};
module.exports = { getAnalyticsData };
