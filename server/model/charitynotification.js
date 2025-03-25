// models/Notification.js
const mongoose = require('mongoose');

const charitynotificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  charityName: { type: String, required: true },
  beneficiaryName: { type: String, required: true },
  status: { type: String, required: true },
//   isRead: { type: Boolean, default: false },
seen: { type: Boolean, default: false }, 
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Approvalsnotification', charitynotificationSchema);
