// controllers/notificationController.js
const Notification = require('../model/charitynotification');

// Create a new notification
exports.createNotification = async (req, res) => {
  try {
    const { charityName, beneficiaryName, status } = req.body;
    const message = `Housecare ${status === 'Accepted' ? 'approved' : 'rejected'} the ${beneficiaryName}'s payment.`;

    const notification = new Notification({
      message,
      charityName,
      beneficiaryName,
      status,
    });

    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Error creating notification' });
  }
};

// Get notifications for a specific charity
// exports.getNotifications = async (req, res) => {
//     try {
//       const { charity } = req.query; // Get charity name from query parameters
  
//       const notifications = await Notification.find({ charityName: charity }).sort({ createdAt: -1 });
  
//       res.status(200).json(notifications);
//     } catch (error) {
//       res.status(500).json({ error: 'Error fetching notifications' });
//     }
//   };
// Get notifications for a specific charity (only unseen)
exports.getNotifications = async (req, res) => {
    try {
      const { charity } = req.query; // Get charity name from query parameters
  
      // Fetch unseen notifications for the specific charity
      const notifications = await Notification.find({ charityName: charity, seen: false }).sort({ createdAt: -1 });
  
      res.status(200).json(notifications);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching notifications' });
    }
  };
  
// Mark notifications as seen for a specific charity
exports.markNotificationsAsSeen = async (req, res) => {
    try {
      const { charity } = req.query; // Get charity name from query parameters
  
      // Update notifications to mark them as seen
      await Notification.updateMany(
        { charityName: charity, seen: false },
        { $set: { seen: true } }
      );
  
      res.status(200).json({ message: 'Notifications marked as seen' });
    } catch (error) {
      res.status(500).json({ error: 'Error marking notifications as seen' });
    }
  };
  
  
  
