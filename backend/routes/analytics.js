const express = require("express");
const router = express.Router();
const { getAnalytics, getAgentAnalytics } = require("../controllers/analytics");

// Route to fetch analytics for a campaign by campaign ID
router.get("/campaign/:campaignId", getAnalytics); // Fetch campaign analytics using campaignId

// Route to fetch agent-specific analytics by agent ID
router.get("/agent/:agentId", getAgentAnalytics); // Fetch agent analytics

module.exports = router;
