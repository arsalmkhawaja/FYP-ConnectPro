const mongoose = require("mongoose");
const Sales = require("../models/Sales");
const Agent = require("../models/Agents");
const form = require("../models/Forms");

exports.createSale = async (req, res) => {
  try {
    const { form, campaign, amount, saleDate, score, sentiment } = req.body;

    const agentData = await Agent.findById(req.user.id);
    if (!agentData) {
      return res.status(404).json({ message: "Agent not found" });
    }

    if (!mongoose.Types.ObjectId.isValid(form)) {
      return res.status(400).json({ message: "Invalid form ID" });
    }

    let campaignData = null;
    if (mongoose.Types.ObjectId.isValid(campaign)) {
      campaignData = campaign;
    } else {
      campaignData = null;
    }

    const sale = new Sales({
      agent: agentData._id,
      form: form,
      campaign: campaignData,
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
