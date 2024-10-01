const mongoose = require("mongoose");
const Campaign = require("../models/Campaigns");
const Agent = require("../models/Agents");

const createCampaign = async (req, res) => {
  console.log("Request body: ", req.body);

  const { name, agentIds = [], sales = 0, targetSales = 0 } = req.body;

  if (!name) {
    console.log("Campaign name missing");
    return res.status(400).json({ error: "Please provide a campaign name." });
  }

  try {
    const agents = await Agent.find({ agentID: { $in: agentIds } });
    const numberOfAgents = agents.length;

    const newCampaign = new Campaign({
      name,
      numberOfAgents,
      agents: agents.map((agent) => agent._id),
      sales,
      targetSales,
    });

    await newCampaign.save();
    console.log("Campaign created successfully: ", newCampaign);
    res.status(201).json({ success: true, data: newCampaign });
  } catch (error) {
    console.error("Error creating campaign: ", error);
    res.status(500).json({ error: "Failed to create campaign." });
  }
};

const getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find().populate("agents");
    res.status(200).json({ success: true, data: campaigns });
  } catch (error) {
    console.error("Error fetching campaigns: ", error);
    res.status(500).json({ error: "Failed to fetch campaigns." });
  }
};

const getCampaign = async (req, res) => {
  const { name } = req.params;

  try {
    const campaign = await Campaign.findOne({ name }).populate("agents");
    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found." });
    }
    res.status(200).json({ success: true, data: campaign });
  } catch (error) {
    console.error("Error fetching campaign: ", error);
    res.status(500).json({ error: "Failed to fetch campaign." });
  }
};

const updateCampaign = async (req, res) => {
  const { name, agentIds = [], sales, targetSales } = req.body;
  const { campaignName } = req.params;

  try {
    let agents = [];
    if (Array.isArray(agentIds) && agentIds.length > 0) {
      agents = await Agent.find({ agentID: { $in: agentIds } });
      if (agents.length !== agentIds.length) {
        return res.status(404).json({ error: "One or more agents not found." });
      }
    }

    const numberOfAgents = agents.length;

    const updatedCampaign = await Campaign.findOneAndUpdate(
      { name: campaignName },
      {
        name,
        numberOfAgents,
        agents: agents.map((agent) => agent._id),
        sales,
        targetSales,
      },
      { new: true }
    ).populate("agents");

    if (!updatedCampaign) {
      return res.status(404).json({ error: "Campaign not found." });
    }

    res.status(200).json({ success: true, data: updatedCampaign });
  } catch (error) {
    console.error("Error updating campaign:", error);
    res.status(500).json({ error: "Failed to update campaign." });
  }
};

const deleteCampaign = async (req, res) => {
  const { name } = req.params;

  try {
    const campaign = await Campaign.findOneAndDelete({ name });

    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Campaign deleted successfully" });
  } catch (error) {
    console.error("Error deleting campaign: ", error);
    res.status(500).json({ error: "Failed to delete campaign" });
  }
};

const addAgentToCampaign = async (req, res) => {
  const { agentId } = req.body;
  const { name } = req.params;

  try {
    const campaign = await Campaign.findOne({ name });
    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found." });
    }

    const agent = await Agent.findOne({ agentID: agentId });
    if (!agent) {
      return res.status(404).json({ error: "Agent not found." });
    }

    if (campaign.agents.includes(agent._id)) {
      return res
        .status(400)
        .json({ error: "Agent is already added to the campaign." });
    }

    campaign.agents.push(agent._id);
    campaign.numberOfAgents += 1;
    await campaign.save();

    res.status(200).json({ success: true, data: campaign });
  } catch (error) {
    console.error("Error adding agent to campaign:", error);
    res.status(500).json({ error: "Failed to add agent to campaign." });
  }
};

const removeAgentFromCampaign = async (req, res) => {
  const { agentId } = req.body;
  const { name } = req.params;

  try {
    const campaign = await Campaign.findOne({ name });
    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found." });
    }

    const agent = await Agent.findOne({ agentID: agentId });
    if (!agent) {
      return res.status(404).json({ error: "Agent not found." });
    }

    campaign.agents = campaign.agents.filter(
      (agentObjId) => agentObjId.toString() !== agent._id.toString()
    );

    campaign.numberOfAgents -= 1;

    await campaign.save();

    res.status(200).json({ success: true, data: campaign });
  } catch (error) {
    console.error("Error removing agent from campaign:", error);
    res.status(500).json({ error: "Failed to remove agent from campaign." });
  }
};
const getCampaignAgents = async (req, res) => {
  const { name } = req.params;

  try {
    const campaign = await Campaign.findOne({ name }).populate("agents");
    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found." });
    }

    res.status(200).json({ success: true, data: campaign.agents });
  } catch (error) {
    console.error("Error fetching agents for campaign:", error);
    res.status(500).json({ error: "Failed to fetch agents for campaign." });
  }
};

module.exports = {
  createCampaign,
  getCampaigns,
  getCampaign,
  updateCampaign,
  deleteCampaign,
  addAgentToCampaign,
  removeAgentFromCampaign,
  getCampaignAgents,
};
