const express = require("express");
const router = express.Router();
const callController = require("../controllers/calls");
const authMiddleware = require("../middleware/auth");
router.post("/calls", authMiddleware, callController.createCall);

router.get("/calls", authMiddleware, callController.getAllCalls);

router.get("/calls/:id", authMiddleware, callController.getCallById);

router.put("/calls/:id", authMiddleware, callController.updateCall);

router.delete("/calls/:id", authMiddleware, callController.deleteCall);

// Route handler
router.get("/agent/:_id", authMiddleware, callController.getCallsByAgent);

module.exports = router;
