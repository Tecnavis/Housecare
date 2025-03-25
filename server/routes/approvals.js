// routes/notificationRoutes.js
const express = require('express');
const Controller = require('../controller/approvalsnotification');
const router = express.Router();

router.post('/notifications', Controller.createNotification);
router.get('/notifications', Controller.getNotifications);
router.delete("/mark-as-seen", Controller.markNotificationsAsSeen);

module.exports = router;
