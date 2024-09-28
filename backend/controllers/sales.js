const mongoose = require("mongoose");
const Sales = require("../models/Sales");
const Agent = require("../models/Agents");

exports.createSale = async (req, res) => {
  try {
    const { form, campaign, amount, saleDate, score, sentiment } = req.body;

    // Fetch the current agent profile using the agent ID from the token
    const agentData = await Agent.findById(req.user.id);
    if (!agentData) {
      return res.status(404).json({ message: "Agent not found" });
    }

    // Validate that form is an ObjectId
    if (!mongoose.Types.ObjectId.isValid(form)) {
      return res.status(400).json({ message: "Invalid form ID" });
    }

    // Handle campaign - check if it's a valid ObjectId
    let campaignData = null;
    if (mongoose.Types.ObjectId.isValid(campaign)) {
      campaignData = campaign;
    } else {
      campaignData = null;
    }

    // Create the sale using the validated agent, form, and campaign
    const sale = new Sales({
      agent: agentData._id, // Use the agent's ObjectId
      form: form, // Directly use the form ID passed from frontend
      campaign: campaignData, // Use campaignData which might be null or an ObjectId
      amount,
      saleDate,
      score,
      sentiment,
    });

    await sale.save();
    res.status(201).json({ message: "Sale created successfully", sale });
  } catch (error) {
    console.error("Error creating sale:", error);
    res.status(500).json({ message: "Error creating sale", error });
  }
};

// Get all sales
exports.getAllSales = async (req, res) => {
  try {
    const sales = await Sales.find()
      .populate("agent")
      .populate("form")
      .populate("campaign");
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific sale by ID
exports.getSaleById = async (req, res) => {
  try {
    const sale = await Sales.findById(req.params.id)
      .populate("agent")
      .populate("form")
      .populate("campaign");
    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }
    res.status(200).json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a sale by ID
exports.updateSale = async (req, res) => {
  try {
    const sale = await Sales.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }
    res.status(200).json(sale);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a sale by ID
exports.deleteSale = async (req, res) => {
  try {
    const sale = await Sales.findByIdAndDelete(req.params.id);
    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }
    res.status(200).json({ message: "Sale deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
