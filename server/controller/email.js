const Emails = require("../model/emails");
const asyncHandler = require("express-async-handler");

// const nodemailer = require("nodemailer");

// exports.sendEmail = async (req, res) => {
//   const { to, cc, subject, message } = req.body;

//   // Create a Nodemailer transporter using your SMTP server details
//   const transporter = nodemailer.createTransport({
//     service: "gmail", // or your email provider
//     auth: {
//       user: "narjishakuniyil@gmail.com", // your email
//       pass: "uizijtixkxgvcvmw", // your email password
//     },
//   });

//   try {
//     // Send the email
//     const info = await transporter.sendMail({
//       from: "narjishakuniyil@gmail.com", // sender address
//       to: to, // list of receivers
//       cc: cc, // CC addresses
//       subject: subject, // Subject line
//       html: message, // HTML body content
//     });

//     console.log("Message sent: %s", info.messageId);
//     res.status(200).send({ message: "Email sent successfully" });
//   } catch (error) {
//     console.error("Error sending email:", error);
//     res.status(500).send({ message: "Failed to send email" });
//   }
// };


exports.create = asyncHandler(async (req, res) => {
  const {email,category } = req.body;

  try {
    const  emails = await Emails.create({
        email: email,category: category,
    });
    if (!emails) {
      console.log("email creation failed");
      res.send("Failed");
    } else {
      res.send("Success");
    }
  } catch (err) {
    console.log(err, "email creation failed");
    return res
      .status(400)
      .json({ err: "something went wrong in email creation" });
  }
});

exports.list = asyncHandler(async (req, res) => {
    try {
        const emails = await Emails.find();
        if (!emails) {
            console.log('something went wrong in email list');
            return res.status(400).json({ message: 'email listing failed something went wrong' });
        }
        res.json(emails);
    } catch (err) {
        console.log(err, 'email listing failed');
        return res.status(500).json({ err: 'email listing failed' });
    }
})

exports.edit = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const emails = await Emails.findById(id);
        if (!emails) {
            console.log('something went wrong in Edit by Id');
            return res.status(400).json({
                message: "an error occured in edit by Id Can't found the email",
            });
        }
        res.json(emails);
    } catch (err) {
        console.log(err, 'an error occured in edit by Id');
        return res
            .status(500)
            .json({ err: 'an error occured in email details edit by Id' });
    }
})


exports.update = asyncHandler(async (req, res) => {
    const { email,category } = req.body;
  const { id } = req.params;
  try {
    const emails = await Emails.findById(id);
    if (!emails) {
      return res.status(400).json({ message: 'Email not found' });
    }
    emails.email = email;
    emails.category = category;
    const updateEmail = await emails.save();
    res.json({ updateEmail });
  } catch (err) {
    console.log(err, 'update email failed');
    return res.status(500).json({ err: 'update email failed' });
  }
})      


exports.delete = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const emails = await Emails.findById(id);
        if (!emails) {
            console.log('email not found');
            return res.status(400).json({ message: 'email not found to delete' });
        } else {
            await emails.deleteOne();
            res.json({ message: 'delete successfully' });
        }
    } catch (err) {
        console.log(err, 'delete failed');
        return res.status(500).json({ message: 'an error occured in email delete' });
    }
})