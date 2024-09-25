const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  registerAdmin,
  registerAgent,
  login,
  getAllUsers,
  deleteAgent,
  editAgent,
  getAllAdmins,
} = require("../controllers/user");
const authMiddleware = require("../middleware/auth"); // Auth middleware to protect routes

// Multer setup for handling profile image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Public routes
router.post("/register/admin", upload.single("profileImage"), registerAdmin); // Register as admin
router.post("/register/agent", upload.single("profileImage"), registerAgent); // Register as agent
router.post("/login", login); // Common login for both admin and agent

// Protected routes
router.get("/users", authMiddleware, getAllUsers); // Get all users (admins and agents)
router.get("/admins", authMiddleware, getAllAdmins); // Get all admins only

// Edit and delete agent routes
router.put(
  "/agent/:id",
  authMiddleware,
  upload.single("profileImage"),
  editAgent
); // Edit agent details
router.delete("/agent/:id", authMiddleware, deleteAgent); // Delete agent

module.exports = router;
