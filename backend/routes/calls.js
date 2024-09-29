const express = require("express");
const router = express.Router();
const {
  createCall,
  getCallById,
  updateCall,
  deleteCall,
  getAllCalls,
  getCallsByAgent,
} = require("../controllers/calls");

// Route to create a new call
router.post("/", createCall);

// Route to get a call by its ID
router.get("/:id", getCallById);

// Route to update a call by its ID
router.put("/:id", updateCall);

// Route to delete a call by its ID
router.delete("/:id", deleteCall);

// Route to get all calls
router.get("/", getAllCalls);

// Route to get all calls made by a specific agent
router.get("/agent/:agentId", getCallsByAgent);

module.exports = router;
