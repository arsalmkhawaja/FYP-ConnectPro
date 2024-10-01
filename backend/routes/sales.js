const express = require("express");
const router = express.Router();
const salesController = require("../controllers/sales");
const authMiddleware = require("../middleware/auth");

router.post("/sales", authMiddleware, salesController.createSale);

router.get("/sales", authMiddleware, salesController.getAllSales);

router.get("/sales/:id", authMiddleware, salesController.getSaleById);

router.put("/sales/:id", authMiddleware, salesController.updateSale);

router.delete("/sales/:id", authMiddleware, salesController.deleteSale);

module.exports = router;
