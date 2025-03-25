const mongoose = require("mongoose");

const debitedSchema = mongoose.Schema({
    debitedDate: { type: Date, default: Date.now },
    debitedAmount: { type: Number, default: 0 },
    transactionId: { type: String },
    beneficiary: { type: mongoose.Schema.Types.ObjectId, ref: "Benficiaries",required: true},  
});

const Debited = mongoose.model("Debited", debitedSchema);
module.exports = Debited;