const express = require('express');
const router = express.Router();
const formController = require('../controllers/forms');

// Route to create a new form entry
router.post('/forms', formController.createForm);

// Route to get all form entries
router.get('/forms', formController.getAllForms);

// Route to get a specific form entry by ID
router.get('/forms/:id', formController.getFormById);

// Route to update a form entry by ID
router.put('/forms/:id', formController.updateForm);

// Route to delete a form entry by ID
router.delete('/forms/:id', formController.deleteForm);

module.exports = router;
