const express = require("express");
const router = express.Router();
const callController = require("../controllers/calls");
const authMiddleware = require("../middleware/auth"); // Assuming you have authentication middleware

// Route to create a new call
router.post("/calls", authMiddleware, callController.createCall);

// Route to get all calls
router.get("/calls", authMiddleware, callController.getAllCalls);

// Route to get a specific call by ID
router.get("/calls/:id", authMiddleware, callController.getCallById);

// Route to update a call by ID
router.put("/calls/:id", authMiddleware, callController.updateCall);

// Route to delete a call by ID
router.delete("/calls/:id", authMiddleware, callController.deleteCall);

router.get("/agent/:id", authMiddleware, callController.getCallsByAgent);

module.exports = router;
