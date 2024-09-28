const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
const Agent = require("../models/Agents");

// Register an Admin
const registerAdmin = async (req, res) => {
  const {
    fullName,
    gender,
    dateOfBirth,
    position,
    phoneNumber,
    address,
    email,
    password,
  } = req.body;

  if (
    !email ||
    !password ||
    !fullName ||
    !gender ||
    !dateOfBirth ||
    !position ||
    !phoneNumber ||
    !address
  ) {
    return res.status(400).json({ msg: "Please provide all required fields" });
  }

  try {
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ msg: "Email already in use" });
    }

    const profileImage = req.file ? req.file.path : undefined;
    const admin = new Admin({
      fullName,
      gender,
      dateOfBirth,
      position,
      phoneNumber,
      address,
      email,
      password,
      profileImage,
    });
    await admin.save();

    res.status(201).json({ admin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Register an Agent
const registerAgent = async (req, res) => {
  const {
    agentID,
    fullName,
    dateOfBirth,
    gender,
    address,
    phoneNumber,
    email,
    hiringDate,
    position,
    workSchedule,
    department,
    education,
    username,
    password,
  } = req.body;

  if (!agentID || !fullName || !email || !password) {
    return res.status(400).json({ msg: "Please provide all required fields" });
  }

  try {
    const agentExists = await Agent.findOne({ email });
    if (agentExists) {
      return res.status(400).json({ msg: "Email already in use" });
    }

    console.log("Incoming password (plain text):", password);

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password for agent:", hashedPassword);

    const profileImage = req.file ? req.file.path : undefined;
    const agent = new Agent({
      agentID,
      fullName,
      dateOfBirth,
      gender,
      address,
      phoneNumber,
      email,
      hiringDate,
      position,
      workSchedule,
      department,
      education,
      username,
      password,
      profileImage,
    });
    await agent.save();

    res.status(201).json({ agent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Edit Agent
const editAgent = async (req, res) => {
  const {
    agentID,
    fullName,
    dateOfBirth,
    gender,
    address,
    phoneNumber,
    email,
    hiringDate,
    position,
    workSchedule,
    department,
    education,
    username,
    password, // Handle password only if it's provided
  } = req.body;

  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) {
      return res.status(404).json({ msg: "Agent not found" });
    }

    // Update fields if provided
    if (agentID) agent.agentID = agentID;
    if (fullName) agent.fullName = fullName;
    if (dateOfBirth) agent.dateOfBirth = dateOfBirth;
    if (gender) agent.gender = gender;
    if (address) agent.address = address;
    if (phoneNumber) agent.phoneNumber = phoneNumber;
    if (email) agent.email = email;
    if (hiringDate) agent.hiringDate = hiringDate;
    if (position) agent.position = position;
    if (workSchedule) agent.workSchedule = workSchedule;
    if (department) agent.department = department;
    if (education) agent.education = education;
    if (username) agent.username = username;
    if (password) agent.password = password;

    if (req.file) {
      agent.profileImage = req.file.path; // Update profile image if provided
    }

    await agent.save();
    res.status(200).json({ agent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Delete Agent
const deleteAgent = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) {
      return res.status(404).json({ msg: "Agent not found" });
    }

    // Use findByIdAndDelete instead of agent.remove()
    await Agent.findByIdAndDelete(req.params.id);

    res.status(200).json({ msg: "Agent removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Login for both Admin and Agent
// Login for both Admin and Agent
const login = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res
      .status(400)
      .json({ msg: "Please provide email, password, and role" });
  }

  try {
    let user;
    if (role === "admin") {
      user = await Admin.findOne({ email });
      console.log("Admin user:", user);
    } else if (role === "agent") {
      user = await Agent.findOne({ email });
      console.log("Agent user:", user);
    }

    if (!user) {
      return res
        .status(400)
        .json({ msg: "Invalid credentials - User not found" });
    }

    // Log stored hashed password and incoming password
    console.log("Stored hashed password for user:", user.password);
    console.log("Incoming password:", password);

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match result:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    // Return the token along with user data (agentID/fullName for agents, etc.)
    res.status(200).json({
      token,
      agentID: role === "agent" ? user.agentID : null,
      fullName: user.fullName,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get all Admins and Agents
const getAllAgents = async (req, res) => {
  try {
    const agents = await Agent.find({});
    res.status(200).json({ agents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};
const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({});
    res.status(200).json({ admins });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

const getAdminProfile = async (req, res) => {
  try {
    console.log("User ID from token:", req.user.id);
    const admin = await Admin.findById(req.user.id); // Fetch the admin using the ID from the token
    if (!admin) {
      return res.status(404).json({ msg: "Admin not found" });
    }
    res.status(200).json({ admin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};
const getAgentProfile = async (req, res) => {
  try {
    console.log("User ID from token:", req.user.id); // Add this line
    const agent = await Agent.findById(req.user.id); // Adjust based on your middleware
    if (!agent) {
      return res.status(404).json({ msg: "Agent not found" });
    }
    res.status(200).json({ agent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = {
  registerAdmin,
  registerAgent,
  login,
  deleteAgent,
  editAgent,
  getAdminProfile,
  getAllAgents,
  getAllAdmins,
  getAgentProfile,
};
