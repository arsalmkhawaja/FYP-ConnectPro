const Analytics = require("../models/Analytics");
const Call = require("../models/Calls");
const Agent = require("../models/Agents");
const Campaign = require("../models/Campaigns");

const calculateAnalytics = async (campaignId) => {
  const campaign = await Campaign.findById(campaignId);
  if (!campaign) throw new Error("Campaign not found");

  // Fetch all calls related to the campaign
  const calls = await Call.find({ campaign: campaignId }).populate("agent");

  // Initialize counters
  let totalCalls = 0;
  let totalSales = 0;
  let totalDuration = 0;
  let agentsPerformance = {};

  // Process each call to aggregate data
  calls.forEach((call) => {
    totalCalls++;
    totalDuration += call.duration;
    if (call.disposition === "Sale") {
      totalSales++;
    }

    // Track agent performance
    if (!agentsPerformance[call.agent._id]) {
      agentsPerformance[call.agent._id] = { totalCalls: 0, totalSales: 0 };
    }
    agentsPerformance[call.agent._id].totalCalls++;
    if (call.disposition === "Sale") {
      agentsPerformance[call.agent._id].totalSales++;
    }
  });

  // Calculate success rate and target achievement
  const successRate = totalCalls > 0 ? (totalSales / totalCalls) * 100 : 0;
  const targetAchievement =
    campaign.targetSales > 0 ? (totalSales / campaign.targetSales) * 100 : 0;

  // Fetch agent data
  const agents = await Agent.find({
    _id: { $in: Object.keys(agentsPerformance) },
  });

  // Prepare agent performance data
  const agentsPerformanceArray = agents.map((agent) => {
    const performance = agentsPerformance[agent._id];
    return {
      agent: agent._id,
      totalCalls: performance.totalCalls,
      totalSales: performance.totalSales,
      performance:
        performance.totalCalls > 0
          ? (performance.totalSales / performance.totalCalls) * 100
          : 0,
    };
  });

  // Create or update the analytics record for the campaign
  const analytics = await Analytics.findOneAndUpdate(
    { campaign: campaignId },
    {
      totalCalls,
      totalSales,
      totalDuration,
      successRate,
      targetAchievement,
      agentsPerformance: agentsPerformanceArray,
    },
    { upsert: true, new: true }
  );

  return analytics;
};

// Controller to fetch campaign analytics
const getAnalytics = async (req, res) => {
  try {
    const { campaignId } = req.params;  // campaignId is retrieved from route parameter
    const analytics = await calculateAnalytics(campaignId);
    res.status(200).json(analytics);  // Return the analytics data
  } catch (error) {
    res.status(500).json({ message: error.message });  // Error handling
  }
};

// Controller to fetch agent-specific analytics
const getAgentAnalytics = async (req, res) => {
  const { agentId } = req.params;  // agentId is retrieved from route parameter

  try {
    // Fetch agent data
    const agent = await Agent.findById(agentId);
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    // Fetch calls made by the agent
    const agentCalls = await Call.find({ agent: agentId }).populate("agent");

    // Initialize data aggregation
    let totalCalls = 0;
    let totalSales = 0;
    let totalDuration = 0;
    let callDisposition = { answered: 0, unanswered: 0 };
    let workingHours = 0;

    // Process agent's calls for analytics
    agentCalls.forEach((call) => {
      totalCalls++;
      totalDuration += call.duration;
      if (call.disposition === "Sale") {
        totalSales++;
      }
      if (call.disposition === "Answered") {
        callDisposition.answered++;
      } else if (call.disposition === "Unanswered") {
        callDisposition.unanswered++;
      }
    });

    // Assuming working hours come from the agent document or is calculated elsewhere
    workingHours = agent.workingHours || 0;

    // Prepare chart data (this matches the frontend structure)
    const chartData = {
      attendance: {
        labels: ["Total Calls", "Total Sales", "Working Hours"],
        values: [totalCalls, totalSales, workingHours],
        chartLabel: "Attendance",
      },
      salesComparative: {
        labels: ["Sales"],
        values: [totalSales],
        chartLabel: "Sales Comparative",
      },
      performanceAnalysis: {
        labels: ["Performance"],
        values: [(totalSales / totalCalls) * 100 || 0],
        chartLabel: "Performance Analysis",
      },
      inboundCalls: {
        labels: ["Inbound Calls"],
        values: [callDisposition.answered],
        chartLabel: "Inbound Calls",
      },
      outboundCalls: {
        labels: ["Outbound Calls"],
        values: [callDisposition.unanswered],
        chartLabel: "Outbound Calls",
      },
      // Add other types of chart data as needed
    };

    // Return data in the format expected by the frontend
    return res.status(200).json({
      [agentId]: {
        totalCalls,
        callDisposition,
        workingHours,
        ...chartData,
      },
    });
  } catch (error) {
    console.error("Error fetching agent analytics:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  calculateAnalytics,
  getAnalytics,
  getAgentAnalytics,
};
