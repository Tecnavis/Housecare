const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const adminSchema = mongoose.Schema({
  admin: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  image: { type: String },
  tokens: { type: String, default: "" },
  role: { type: String, required: true },
  otp: { type: Number, default: null }, // OTP for password reset
  otpExpires: { type: Date, default: null } // OTP expiration time
});

adminSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    if (!this.password.startsWith("$2b$")) {
      try {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        next();
      } catch (err) {
        console.log(err.message, "something went wrong in password hashing");
        return next(err);
      }
    } else {
      console.log("Password is already hashed.");
      return next();
    }
  } else {
    return next();
  }
});

const SuperAdmin = mongoose.model("SuperAdmin", adminSchema);
module.exports = SuperAdmin;
