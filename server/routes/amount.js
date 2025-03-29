// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const amoundController = require('../controller/amount');

// Create a amound
router.post('/', amoundController.create);

// Get all amound
router.get('/',  amoundController.getAll);

//  Get a specific amound

router.get('/:id', amoundController.getById);


// Update specific amound
router.patch('/:id', amoundController.update);

// Delete a amound
router.delete('/:id', amoundController.delete);

module.exports = router;
