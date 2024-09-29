const Call = require("../models/Calls");

// Create a new call
exports.createCall = async (req, res) => {
  try {
    const call = new Call(req.body);
    await call.save();
    res.status(201).json(call);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a call by ID
exports.getCallById = async (req, res) => {
  try {
    const call = await Call.findById(req.params.id)
      .populate("form")
      .populate("agent")
      .populate("campaign");
    if (!call) {
      return res.status(404).json({ message: "Call not found" });
    }
    res.status(200).json(call);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a call by ID
exports.updateCall = async (req, res) => {
  try {
    const call = await Call.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!call) {
      return res.status(404).json({ message: "Call not found" });
    }
    res.status(200).json(call);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a call by ID
exports.deleteCall = async (req, res) => {
  try {
    const call = await Call.findByIdAndDelete(req.params.id);
    if (!call) {
      return res.status(404).json({ message: "Call not found" });
    }
    res.status(200).json({ message: "Call deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all calls
exports.getAllCalls = async (req, res) => {
  try {
    const calls = await Call.find()
      .populate("form")
      .populate("agent")
      .populate("campaign");
    res.status(200).json(calls);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Find all calls made by a specific agent
exports.getCallsByAgent = async (req, res) => {
  try {
    const agentId = req.params.agentId;
    const calls = await Call.find({ agent: agentId })
      .populate("form")
      .populate("campaign");
    if (calls.length === 0) {
      return res.status(404).json({ message: "No calls found for this agent" });
    }
    res.status(200).json(calls);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
