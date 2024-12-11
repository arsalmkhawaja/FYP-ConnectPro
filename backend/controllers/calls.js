// callController.js

const mongoose = require("mongoose");
const fs = require("fs"); // For handling file system operations
const Call = require("../models/Calls");
const Agent = require("../models/Agents");

// Helper function to decode Base64 to Buffer
const base64ToBuffer = (base64) => {
  return Buffer.from(base64, "base64");
};

// Create a new call record
exports.createCall = async (req, res) => {
  try {
    console.log("Received req.body:", req.body);

    const {
      phoneNumber,
      form,
      campaign,
      duration,
      sentiment,
      disposition,
      transcription,
      recording, // Base64 string
    } = req.body;

    // Validate required fields
    if (!phoneNumber || !duration || !disposition) {
      return res.status(400).json({
        message: "Missing required fields",
        error: {
          phoneNumber: phoneNumber ? undefined : "phoneNumber is required",
          duration: duration ? undefined : "duration is required",
          disposition: disposition ? undefined : "disposition is required",
        },
      });
    }

    // Fetch agent data using the logged-in user's ID
    const agentData = await Agent.findById(req.user.id);
    if (!agentData) {
      return res.status(404).json({ message: "Agent not found" });
    }

    // Validate form ID if provided
    let formId = null;
    if (form && mongoose.Types.ObjectId.isValid(form)) {
      formId = form;
    }

    // Handle recording if provided
    let recordingBuffer = null;
    if (recording) {
      recordingBuffer = base64ToBuffer(recording);
    }

    // Create a new call record
    const newCall = new Call({
      phoneNumber,
      agent: agentData._id,
      form: formId,
      campaign,
      duration,
      sentiment,
      disposition,
      transcription,
      recording: recordingBuffer, // Save recording binary data
    });

    await newCall.save();

    res.status(201).json({ message: "Call saved successfully", newCall });
  } catch (error) {
    console.error("Error saving call:", error);
    res.status(500).json({ message: "Error saving call", error });
  }
};



exports.getAllCalls = async (req, res) => {
  try {
    const calls = await Call.find()
      .populate("agent")
      .populate("form")
      .populate("campaign");

    res.status(200).json({ calls }); // Wrap calls in an object
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get a single call by ID
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

// Update a call record
exports.updateCall = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Handle recording file if uploaded
    if (req.file) {
      const recordingBuffer = fs.readFileSync(req.file.path);
      updateData.recording = recordingBuffer; // Add recording to update data

      // Clean up temporary file
      fs.unlinkSync(req.file.path);
    }

    const call = await Call.findByIdAndUpdate(req.params.id, updateData, {
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

// Delete a call record
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

// Get all calls associated with a specific agent
exports.getCallsByAgent = async (req, res) => {
  try {
    const agentId = req.params._id;

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

// Serve a call's recording file
exports.getCallRecording = async (req, res) => {
  try {
    const call = await Call.findById(req.params.id);
    if (!call || !call.recording) {
      return res.status(404).json({ message: "Recording not found" });
    }

    res.set("Content-Type", "audio/wav");
    res.send(call.recording);
  } catch (error) {
    console.error("Error fetching recording:", error);
    res.status(500).json({ message: "Error fetching recording", error });
  }
};
