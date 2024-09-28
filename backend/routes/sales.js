const express = require("express");
const router = express.Router();
const salesController = require("../controllers/sales");
const authMiddleware = require("../middleware/auth"); // Assuming you have an authentication middleware

// Route to create a new sale
router.post("/sales", authMiddleware, salesController.createSale);

// Route to get all sales
router.get("/sales", authMiddleware, salesController.getAllSales);

// Route to get a specific sale by ID
router.get("/sales/:id", authMiddleware, salesController.getSaleById);

// Route to update a sale by ID
router.put("/sales/:id", authMiddleware, salesController.updateSale);

// Route to delete a sale by ID
router.delete("/sales/:id", authMiddleware, salesController.deleteSale);

module.exports = router;
