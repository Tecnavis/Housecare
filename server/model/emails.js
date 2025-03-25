const mongoose = require("mongoose");

const emailSchema = mongoose.Schema({
    email: { type: String, required: true },
    category: { type: String, required: true },
});

const Emails = mongoose.model("Emails", emailSchema);
module.exports = Emails;