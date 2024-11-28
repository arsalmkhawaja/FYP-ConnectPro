const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const AgentSchema = new mongoose.Schema({
  agentID: {
    type: String,
    required: [true, "Please provide an agent ID"],
    unique: true,
  },
  fullName: {
    type: String,
    required: [true, "Please provide a full name"],
  },
  dateOfBirth: {
    type: Date,
    required: [true, "Please provide a date of birth"],
  },
  gender: {
    type: String,
    required: [true, "Please provide a gender"],
  },
  address: {
    type: String,
    required: [true, "Please provide an address"],
  },
  phoneNumber: {
    type: String,
    required: [true, "Please provide a phone number"],
    match: [/^\+?\d{10,15}$/, "Please provide a valid phone number"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
  },
  hiringDate: {
    type: Date,
    required: [true, "Please provide a hiring date"],
  },
  position: {
    type: String,
    required: [true, "Please provide a position"],
  },
  workSchedule: {
    type: String,
    required: [true, "Please provide a work schedule"],
  },
  department: {
    type: String,
    required: [true, "Please provide a department"],
  },
  education: {
    type: String,
    required: [true, "Please provide an education"],
  },
  username: {
    type: String,
    required: [true, "Please provide a username"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 3,
  },
  profileImage: {
    type: String,
  },
  status: {
    type: String,
    enum: ["In-Call", "Offline", "Paused", "Online"],
    default: "Offline",
  },
});

AgentSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

AgentSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("Agent", AgentSchema);
