const Form = require("../models/Forms");

exports.createForm = async (req, res) => {
  try {
    const form = new Form(req.body);
    await form.save();
    res.status(201).json(form);
  } catch (error) {
    console.error("Error saving form:", error);
    res
      .status(400)
      .json({ message: "Failed to save form", error: error.message });
  }
};

exports.getAllForms = async (req, res) => {
  try {
    const forms = await Form.find();
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFormById = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (form == null) {
      return res.status(404).json({ message: "Form not found" });
    }
    res.status(200).json(form);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateForm = async (req, res) => {
  try {
    const form = await Form.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (form == null) {
      return res.status(404).json({ message: "Form not found" });
    }
    res.status(200).json(form);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteForm = async (req, res) => {
  try {
    const form = await Form.findByIdAndDelete(req.params.id);
    if (form == null) {
      return res.status(404).json({ message: "Form not found" });
    }
    res.status(200).json({ message: "Form deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getFormByPhoneNumber = async (req, res) => {
  try {
    const phoneNumber = req.params.phoneNumber;
    console.log("Received phone number:", phoneNumber);

    const form = await Form.findOne({
      phoneNumber: Number(phoneNumber),
    }).select("_id");
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    res.status(200).json({ formId: form._id });
  } catch (error) {
    console.error("Error fetching form:", error);
    res.status(500).json({ message: "Server error" });
  }
};
