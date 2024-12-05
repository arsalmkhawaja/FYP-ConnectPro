// controllers/scriptController.js
const Script = require("../models/Scripts");

// Create a new script
exports.createScript = async (req, res) => {
  const { name, script } = req.body;

  if (!name || !script) {
    return res.status(400).json({ message: "Name and script are required" });
  }

  try {
    const newScript = new Script({ name, script });
    await newScript.save();
    res.status(201).json(newScript);
  } catch (error) {
    res.status(500).json({ message: "Error creating script", error });
  }
};

// Get all scripts
exports.getAllScripts = async (req, res) => {
  try {
    const scripts = await Script.find();
    res.status(200).json(scripts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching scripts", error });
  }
};

// Get script by ID
exports.getScriptById = async (req, res) => {
  const { id } = req.params;

  try {
    const script = await Script.findById(id);
    if (!script) {
      return res.status(404).json({ message: "Script not found" });
    }
    res.status(200).json(script);
  } catch (error) {
    res.status(500).json({ message: "Error fetching script", error });
  }
};

// Update a script
exports.updateScript = async (req, res) => {
  const { id } = req.params;
  const { name, script } = req.body;

  try {
    const updatedScript = await Script.findByIdAndUpdate(
      id,
      { name, script },
      { new: true }
    );
    if (!updatedScript) {
      return res.status(404).json({ message: "Script not found" });
    }
    res.status(200).json(updatedScript);
  } catch (error) {
    res.status(500).json({ message: "Error updating script", error });
  }
};

// Delete a script
exports.deleteScript = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedScript = await Script.findByIdAndDelete(id);
    if (!deletedScript) {
      return res.status(404).json({ message: "Script not found" });
    }
    res.status(200).json({ message: "Script deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting script", error });
  }
};
