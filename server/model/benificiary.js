const mongoose = require("mongoose");
const Charity = require("./charity");

const benificiarySchema = new mongoose.Schema({
  benificiary_id: { type: String, unique: true },

  benificiary_name: { type: String, required: true },
  email_id: { type: String, required: true },
  number: Number,

  charity_name: { type: String, required: true },
  charity_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Charity",
    required: true
  },

  nationality: String,
  sex: String,
  health_status: String,
  marital: String,
  navision_linked_no: String,
  physically_challenged: String,
  family_members: Number,
  account_status: String,
  Balance: { type: Number, default: 0 },
  category: String,
  age: Number,
  isBlocked: { type: Boolean, default: false }
}, { timestamps: true });

/* AUTO ID GENERATION */
benificiarySchema.pre("save", async function (next) {
  if (!this.isNew) return next();

  const charity = await Charity.findById(this.charity_id);
  if (!charity || !charity.prifix) {
    return next(new Error("Invalid charity or prefix"));
  }

  const last = await this.constructor
    .findOne({ charity_id: charity._id })
    .sort({ createdAt: -1 });

  let num = 1;
  if (last?.benificiary_id) {
    num = parseInt(last.benificiary_id.replace(charity.prifix, ""), 10) + 1;
  }

  this.benificiary_id = `${charity.prifix}${num.toString().padStart(5, "0")}`;
  next();
});

module.exports = mongoose.model("Benificiaries", benificiarySchema);
