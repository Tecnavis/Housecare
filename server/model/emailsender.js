const mongoose = require("mongoose");

const emailsenderSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true }
});

const Emailsender = mongoose.model("Emailsender", emailsenderSchema);
module.exports = Emailsender;