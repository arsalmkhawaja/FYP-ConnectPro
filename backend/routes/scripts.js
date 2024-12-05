// routes/scriptRoutes.js
const express = require("express");
const router = express.Router();
const scriptController = require("../controllers/scripts");
const authMiddleware = require("../middleware/auth");

// Route to create a new script
router.post("/scripts", authMiddleware, scriptController.createScript);

// Route to get all scripts
router.get("/scripts", authMiddleware, scriptController.getAllScripts);

// Route to get a single script by ID
router.get("/scripts/:id", authMiddleware, scriptController.getScriptById);

// Route to update a script by ID
router.put("/scripts/:id", authMiddleware, scriptController.updateScript);

// Route to delete a script by ID
router.delete("/scripts/:id", authMiddleware, scriptController.deleteScript);

module.exports = router;
