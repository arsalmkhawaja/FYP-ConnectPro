const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  registerAdmin,
  registerAgent,
  login,
  deleteAgent,
  editAgent,
  getAdminProfile,
  getAllAdmins,
  getAllAgents,
  getAgentProfile,
} = require("../controllers/user");
const authMiddleware = require("../middleware/auth");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/register/admin", upload.single("profileImage"), registerAdmin);
router.post("/register/agent", upload.single("profileImage"), registerAgent);
router.post("/login", login);
router.get("/users", authMiddleware, getAllAgents);
router.get("/admins", authMiddleware, getAllAdmins);
router.get("/admin", authMiddleware, getAdminProfile);
router.get("/agent", authMiddleware, getAgentProfile);

router.put(
  "/agent/:id",
  authMiddleware,
  upload.single("profileImage"),
  editAgent
);
router.delete("/agent/:id", authMiddleware, deleteAgent);

module.exports = router;
