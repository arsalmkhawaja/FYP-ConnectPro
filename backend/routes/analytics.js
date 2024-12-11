const express = require("express");
const { getAnalyticsData } = require("../controllers/analytics");

const router = express.Router();

// Route to fetch analytics data
router.get("/analytics/:agentId", getAnalyticsData);

module.exports = router;
