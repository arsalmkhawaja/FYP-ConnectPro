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
  getCampaignAgents,
} = require("../controllers/campaign_controller");
const authMiddleware = require("../middleware/auth");

router.post("/campaigns", authMiddleware, createCampaign);

router.get("/campaigns", authMiddleware, getCampaigns);

router.get("/campaigns/:name", authMiddleware, getCampaign);

router.get("/campaigns/:name/agents", authMiddleware, getCampaignAgents);

router.put("/campaigns/:campaignName", authMiddleware, updateCampaign);

router.delete("/campaigns/:name", authMiddleware, deleteCampaign);

router.post("/campaigns/:name/agents", authMiddleware, addAgentToCampaign);

router.delete(
  "/campaigns/:name/agents",
  authMiddleware,
  removeAgentFromCampaign
);

module.exports = router;
