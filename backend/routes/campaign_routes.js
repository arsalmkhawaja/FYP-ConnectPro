const express = require("express");
const router = express.Router();
const {
  createCampaign,
  getCampaigns,
  getCampaign,
  updateCampaign,
  deleteCampaign,
  addAgentToCampaign,
  removeAgentFromCampaign,
  getCampaignAgents, // Import the new controller function
} = require("../controllers/campaign_controller");
const authMiddleware = require("../middleware/auth"); // Authentication middleware

// Route to create a new campaign
router.post("/campaigns", authMiddleware, createCampaign);

// Route to get all campaigns
router.get("/campaigns", authMiddleware, getCampaigns);

// Route to get a single campaign by name
router.get("/campaigns/:name", authMiddleware, getCampaign);

// Route to get all agents for a campaign by name
router.get("/campaigns/:name/agents", authMiddleware, getCampaignAgents); // New Route

// Route to update a campaign by name
router.put("/campaigns/:campaignName", authMiddleware, updateCampaign);

// Route to delete a campaign by name
router.delete("/campaigns/:name", authMiddleware, deleteCampaign);

// Route to add an agent to a campaign by name
router.post("/campaigns/:name/agents", authMiddleware, addAgentToCampaign);

// Route to remove an agent from a campaign by name
router.delete(
  "/campaigns/:name/agents",
  authMiddleware,
  removeAgentFromCampaign
);

module.exports = router;
