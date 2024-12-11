const express = require("express");
const router = express.Router();
const callController = require("../controllers/calls");
const authMiddleware = require("../middleware/auth");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
router.post("/calls", authMiddleware, callController.createCall);

router.get("/call", authMiddleware, callController.getAllCalls);

router.get("/calls/:id", authMiddleware, callController.getCallById);

router.put("/calls/:id", authMiddleware, callController.updateCall);

router.delete("/calls/:id", authMiddleware, callController.deleteCall);

// Route handler
router.get("/agent/:_id", authMiddleware, callController.getCallsByAgent);

router.post(
  "/api/v5/calls",
  upload.single("recording"),
  callController.createCall
);

module.exports = router;
