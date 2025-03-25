const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema({
 notificationcount: { type: Number, required: true },
//  message: { type: String, required: true },
//  charityName: { type: String, required: true },
});

const Notifications = mongoose.model("Notifications", notificationSchema);
module.exports = Notifications;