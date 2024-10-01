const mongoose = require("mongoose");
const Call = require("../models/Calls");
const Agent = require("../models/Agents");

exports.createCall = async (req, res) => {
  try {
    const {
      phoneNumber,
      form,
      campaign,
      duration,
      sentiment,
      disposition,
      transcription,
    } = req.body;

    // Fetch the current agent profile using the agent ID from the token
    const agentData = await Agent.findById(req.user.id);
    if (!agentData) {
      return res.status(404).json({ message: "Agent not found" });
    }

    // If form ID is provided, validate it; otherwise, set it to null
    let formId = null;
    if (form && mongoose.Types.ObjectId.isValid(form)) {
      formId = form;
    }

    // Create the call using the validated agent, form (if available), and other data
    const newCall = new Call({
      phoneNumber,
      agent: agentData._id, // Use the agent's ObjectId
      form: formId, // Form might be null if not provided or invalid
      campaign, // Campaign could be null or an ObjectId
      duration,
      sentiment,
      disposition,
      transcription,
    });

    await newCall.save();
    res.status(201).json({ message: "Call saved successfully", newCall });
  } catch (error) {
    console.error("Error saving call:", error);
    res.status(500).json({ message: "Error saving call", error });
  }
};

// Get all calls
exports.getAllCalls = async (req, res) => {
  try {
    const calls = await Call.find()
      .populate("agent")
      .populate("form")
      .populate("campaign");

    res.status(200).json(calls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific call by ID
exports.getCallById = async (req, res) => {
  try {
    const call = await Call.findById(req.params.id)
      .populate("agent")
      .populate("form")
      .populate("campaign");
    if (!call) {
      return res.status(404).json({ message: "Call not found" });
    }
    res.status(200).json(call);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a call by ID
exports.updateCall = async (req, res) => {
  try {
    const call = await Call.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!call) {
      return res.status(404).json({ message: "Call not found" });
    }
    res.status(200).json(call);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a call by ID
exports.deleteCall = async (req, res) => {
  try {
    const call = await Call.findByIdAndDelete(req.params.id);
    if (!call) {
      return res.status(404).json({ message: "Call not found" });
    }
    res.status(200).json({ message: "Call deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getCallsByAgent = async (req, res) => {
  try {
    const agentId = req.params.agentId;

    // Validate the agentId
    if (!mongoose.Types.ObjectId.isValid(agentId)) {
      return res.status(400).json({ message: "Invalid agent ID" });
    }

    const calls = await Call.find({ agent: agentId })
      .populate("agent")
      .populate("campaign");
    res.status(200).json(calls);
  } catch (error) {
    console.error("Error fetching calls for agent:", error);
    res.status(500).json({ message: "Error fetching calls for agent", error });
  }
};
