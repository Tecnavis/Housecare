const Superadmin = require("../model/housecareadmin");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const crypto = require('crypto');
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');

exports.requestOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const superadmin = await Superadmin.findOne({ email: email });
  if (!superadmin) {
    return res.status(400).json({ message: "Admin not found" });
  }

  const otp = crypto.randomInt(100000, 999999); // Generate a 6-digit OTP
  superadmin.otp = otp;
  superadmin.otpExpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

  await superadmin.save();

  // Send OTP to user's email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "narjishakuniyil@gmail.com", // your email
      pass: "uizijtixkxgvcvmw",
    },
  });

  const mailOptions = {
    from: 'narjishakuniyil@gmail.com',
    to: superadmin.email,
    subject: 'Your OTP for Password Reset',
    text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Email sent: ' + info.response);
    res.status(200).json({ message: 'OTP sent to your email.' });
  });
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const superadmin = await Superadmin.findOne({ email: email });
  if (!superadmin) {
    return res.status(400).json({ message: "Admin not found" });
  }

  // Debugging: Log OTP and expiry details
  console.log('Stored OTP:', superadmin.otp);
  console.log('Stored OTP Expires:', new Date(superadmin.otpExpires).toLocaleString());
  console.log('Current Time:', new Date().toLocaleString());

  if (superadmin.otp !== parseInt(otp) || superadmin.otpExpires < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  // Reset the password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  superadmin.password = hashedPassword;
  superadmin.otp = undefined; // Clear the OTP
  superadmin.otpExpires = undefined;

  await superadmin.save();

  res.status(200).json({ message: "Password has been reset successfully." });
});




exports.signinadmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    const superadmin = await Superadmin.findOne({ email: email });
    if (!superadmin) {
      console.log("admin not found with email:", email);
      return res
        .status(400)
        .json({ invalid: true, message: "Invalid email or password" });
    }
    const isPasswordIsMatch = await bcrypt.compare(
      password,
      superadmin.password
    );
    if (superadmin && isPasswordIsMatch) {
      const  HomecareAdmin = {
        // Superadmin
        admin: superadmin.admin,
        email: superadmin.email,
        image: superadmin.image,
        id:superadmin._id,
        role:superadmin.role
      };
      // const roles = superadmin.role
      const token = jwt.sign({ email: superadmin.email }, "myjwtsecretkey");
      superadmin.tokens = token;
      await superadmin.save();
      console.log("Signin successful, token generated");
      res.status(200).json({ token: token, HomecareAdmin: HomecareAdmin });
    } else {
      console.log("Password mismatch for email:", email);
      return res
        .status(400)
        .json({ invalid: true, message: "Invalid email or password" });
    }
  } catch (err) {
    console.log(err, "signin  failed");
    return res.status(500).json({ err: "Invalid email or password" });
  }
});

exports.lists = asyncHandler(async (req, res) => {
  try {
    const admins = await Superadmin.findOne();
    res.json(admins);
  } catch (err) {
    console.log(err, "Error listing admins");
    return res.status(500).json({ err: "Error listing admins" });
  }
});

exports.edit =asyncHandler(async(req,res)=>{
const {id}= req.params
try{
const admins = await Superadmin.findById(id)
if(!admins){
  return res.status(400).json({message:"Admin not found "})
}
res.json(admins)
}catch(err){
  console.log(err,"fetching admin details failed");
  return res.status(500).json({message:"an error occured in fetching admin details"})
}
})

exports.updateAdmin = asyncHandler(async (req, res) => {
  const { admin, email ,role} = req.body;
  const { id } = req.params;
  try {
    const admins = await Superadmin.findById(id);
    if (!admins) {
      return res.status(400).json({ message: "admin not found for update" });
    }
    admins.email = email;
    admins.role = role;
    admins.admin = admin;
    if (req.file) {
      admins.image = req.file.filename;
    }
    const adminUpdate = await admins.save();
    res.json(adminUpdate);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ err: "an error occured" });
  }
});