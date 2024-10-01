const express = require("express");
const router = express.Router();
const formController = require("../controllers/forms");
const authMiddleware = require("../middleware/auth");

router.post("/forms", formController.createForm);

router.get("/forms", formController.getAllForms);

router.get("/forms/:id", formController.getFormById);

router.put("/forms/:id", formController.updateForm);

router.delete("/forms/:id", formController.deleteForm);

router.get(
  "/forms/phone/:phoneNumber",
  authMiddleware,
  formController.getFormByPhoneNumber
);

module.exports = router;
