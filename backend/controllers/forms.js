const Form = require("../models/Forms");

// Create a new form entry
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

// Get all form entries
exports.getAllForms = async (req, res) => {
  try {
    const forms = await Form.find();
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific form entry by ID
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

// Update a form entry by ID
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

// Delete a form entry by ID
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
    console.log("Received phone number:", phoneNumber); // Debugging line

    // Find the form by phone number
    const form = await Form.findOne({
      phoneNumber: Number(phoneNumber),
    }).select("_id"); // Only select the _id field

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    // Return the ObjectId
    res.status(200).json({ formId: form._id });
  } catch (error) {
    console.error("Error fetching form:", error);
    res.status(500).json({ message: "Server error" });
  }
};
