const mongoose = require("mongoose");

const notificationssSchema = new mongoose.Schema({
    charityName: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false }
 });

const Notificationn = mongoose.model("Notificationn", notificationssSchema);

module.exports = Notificationn;
