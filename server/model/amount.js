const mongoose = require("mongoose");

const amountSchema = mongoose.Schema({
    amount: { type: Number },  
});

const Amount = mongoose.model("Amount", amountSchema);
module.exports = Amount;