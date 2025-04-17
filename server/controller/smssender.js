const asyncHandler = require("express-async-handler");
const Smssender = require("../model/smssender");


exports.create = asyncHandler(async (req, res) => {
  
  try {
    const { phone } = req.body;
    const  creteAphone = await Smssender.create({  phone });
    if (!creteAphone) {
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
        const  phones = await Smssender.find();
        if (!phones) {
            console.log('something went wrong in phone list');
            return res.status(400).json({ message: 'phone listing failed something went wrong' });
        }
        res.json(phones);
    } catch (err) {
        console.log(err, 'phone listing failed');
        return res.status(500).json({ err: 'phone listing failed' });
    }
})

exports.edit = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const  phones = await Smssender.findById(id);
        if (!phones) {
            console.log('something went wrong in Edit by Id');
            return res.status(400).json({
                message: "an error occured in edit by Id Can't found the email",
            });
        }
        res.json(phones);
    } catch (err) {
        console.log(err, 'an error occured in edit by Id');
        return res
            .status(500)
            .json({ err: 'an error occured in email details edit by Id' });
    }
})


exports.update = asyncHandler(async (req, res) => {
    const {  phone } = req.body;
  const { id } = req.params;

  try {
    const updatedPhone = await Smssender.findOneAndUpdate(
      { _id: id },
      {  phone }, 
      { new: true, runValidators: true } 
    );

    if (!updatedPhone) {
      return res.status(404).json({ message: "phone not found" });
    }

    res.status(200).json({ message: "phone updated successfully", updatedPhone });
  } catch (err) {
    console.error("Update phone failed:", err);
    res.status(500).json({ error: "Failed to update phone" });
  }
})      


exports.delete = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const phones = await Smssender.findById(id);
        if (!phones) {
            console.log('phone not found');
            return res.status(400).json({ message: 'phone not found to delete' });
        } else {
            await phones.deleteOne();
            res.json({ message: 'delete successfully' });
        }
    } catch (err) {
        console.log(err, 'delete failed');
        return res.status(500).json({ message: 'an error occured in phone delete' });
    }
})