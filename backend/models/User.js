const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["admin", "agent"],
    required: [true, "Please specify a role (admin or agent)"],
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
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 3,
  },
  profileImage: {
    type: String,
  },
  // Fields for agents only
  agentID: {
    type: String,
    required: function () {
      return this.role === "agent";
    },
  },
  fullName: {
    type: String,
    required: function () {
      return this.role === "agent";
    },
  },
  dateOfBirth: {
    type: Date,
    required: function () {
      return this.role === "agent";
    },
  },
  gender: {
    type: String,
    required: function () {
      return this.role === "agent";
    },
  },
  address: {
    type: String,
    required: function () {
      return this.role === "agent";
    },
  },
  phoneNumber: {
    type: String,
    required: function () {
      return this.role === "agent";
    },
  },
  hiringDate: {
    type: Date,
    required: function () {
      return this.role === "agent";
    },
  },
  position: {
    type: String,
    required: function () {
      return this.role === "agent";
    },
  },
  workSchedule: {
    type: String,
    required: function () {
      return this.role === "agent";
    },
  },
  department: {
    type: String,
    required: function () {
      return this.role === "agent";
    },
  },
  education: {
    type: String,
    required: function () {
      return this.role === "agent";
    },
  },
});

UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
