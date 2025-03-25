// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const notificationController = require('../controller/notification');

// Route to create a notification
router.post('/', notificationController.createNotification);

// Route to get notifications for a specific charity
router.get('/notifications', notificationController.getNotificationsForCharity);

// Route to mark notifications as read for a specific charity
router.patch('/notifications/:charityName/read', notificationController.markNotificationsAsRead);

// Delete a notification
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;
