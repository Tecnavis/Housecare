// controllers/notificationController.js
const Notification = require('../model/notification2');

// Create a new notification
const createNotification = async (req, res) => {
  const { charityName, message } = req.body;

  try {
    const notification = new Notification({
      charityName,
      message
    });
    await notification.save();
    res.status(201).json({ message: 'Notification created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating notification', error });
  }
};

// Get all notifications for a specific charity
const getNotificationsForCharity = async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving notifications', error });
  }
};

// Mark notifications as read
const markNotificationsAsRead = async (req, res) => {
  const { charityName } = req.params;

  try {
    await Notification.updateMany(
      { charityName },
      { $set: { isRead: true } }
    );
    res.status(200).json({ message: 'Notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error marking notifications as read', error });
  }
};


// Delete a notification
const deleteNotification = async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await Notification.findByIdAndDelete(id);
      if (result) {
        res.status(200).json({ message: 'Notification deleted successfully' });
      } else {
        res.status(404).json({ message: 'Notification not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error deleting notification', error });
    }
  };
  module.exports = {
    createNotification,
    getNotificationsForCharity,
    markNotificationsAsRead,
    deleteNotification
  };