const mongoose = require("mongoose");

const formSchema = new mongoose.Schema(
  {
    title: { type: String },
    firstName: { type: String, required: true },
    lastName: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    email: { type: String },
    comments: { type: String },
    phoneNumber: { type: String, required: true },
    altPhoneNumber: { type: String },
  },
  { timestamps: true }
);

const Form = mongoose.model("Form", formSchema);

module.exports = Form;
