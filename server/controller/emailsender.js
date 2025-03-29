const Emailsender = require("../model/emailsender");
const asyncHandler = require("express-async-handler");



exports.create = asyncHandler(async (req, res) => {
  const { email } = req.body;

  try {
    const  emails = await Emailsender.create({ email });
    if (!emails) {
      res.send("Failed");
    } else {
      res.send("Success");
    }
  } catch (err) {
    return res
      .status(400)
      .json({ err: "something went wrong in email creation" });
  }
});

exports.list = asyncHandler(async (req, res) => {
    try {
        const emails = await Emailsender.find();
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
        const emails = await Emailsender.findById(id);
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
    const { email } = req.body;
  const { id } = req.params;

  try {
    const updatedEmail = await Emailsender.findOneAndUpdate(
      { _id: id },
      { email }, 
      { new: true, runValidators: true } 
    );

    if (!updatedEmail) {
      return res.status(404).json({ message: "Email not found" });
    }

    res.status(200).json({ message: "Email updated successfully", updatedEmail });
  } catch (err) {
    console.error("Update email failed:", err);
    res.status(500).json({ error: "Failed to update email" });
  }
})      


exports.delete = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const emails = await Emailsender.findById(id);
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