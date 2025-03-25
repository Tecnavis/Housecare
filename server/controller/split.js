const Splits = require("../model/split");
const Debited = require("../model/debited");
const Benificiary = require("../model/benificiary");
const Notifications = require("../model/notification");
const nodemailer = require('nodemailer');
const fs = require('fs');
require('dotenv').config();  // Load environment variables

exports.sendPdf =async (req, res) => {
  try {
    const { filename, path: filePath } = req.file;

    // Set up Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send email with the Excel file attachment
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'navaskuniyil6@gmail.com',
      subject: 'Excel Document from Housecare',
      text: 'Please find the attached Excel document.',
      attachments: [
        {
          filename: 'split_details.xlsx',
          path: filePath,
        },
      ],
    });

    // Clean up the uploaded file
    fs.unlinkSync(filePath);

    res.status(200).json({ message: 'Excel file sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send Excel file.' });
  }
};



exports.saveSplits = async (req, res) => {
  try {
    const { splits } = req.body;
    await Splits.insertMany(splits);
    res.status(200).json({ message: "Splits saved successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to save splits" });
  }
};

exports.getSplits = async (req, res) => {
  try {
    const splits = await Splits.find().populate("beneficiary");
    res.status(200).json(splits);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch splits" });
  }
};

// Controller function to delete a split by ID
exports.deleteSplit = async (req, res) => {
    const { id } = req.params;
    
    try {
      const result = await Splits.findByIdAndDelete(id);
  
      if (!result) {
        return res.status(404).json({ message: 'Split not found' });
      }
  
      res.status(200).json({ message: 'Split deleted successfully' });
    } catch (error) {
      console.error('Error deleting split:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

// upload

exports.updateSplitById = async (req, res) => {
  try {
    const { id } = req.params;
    const { beneficiary, ...splitData } = req.body;

    // Update the Split
    const updatedSplit = await Splits.findByIdAndUpdate(id, splitData, { new: true });
    
    if (!updatedSplit) {
      return res.status(404).send('Split not found');
    }
    
    // Update the Benificiary
    const benfID = await Splits.findById(id).populate("beneficiary");
    const beneficiar = await Benificiary.findById(benfID.beneficiary);
    const updatedBeneficiary = await Benificiary.findByIdAndUpdate(beneficiar._id, beneficiary);

    if (!updatedBeneficiary) {
      return res.status(404).send('Beneficiary not found');
    }

    res.json({
      split: updatedSplit,
      beneficiary: updatedBeneficiary
    });
  } catch (error) {
    console.error("Error updating split and beneficiary:", error);
    res.status(500).send('Server Error');
  }
};
//split status
exports.updateSplitStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
      const split = await Splits.findById(id);

      if (!split) {
          return res.status(404).json({ message: 'Split not found' });
      }

      split.status = status;
      await split.save();

      res.json({ message: 'Status updated successfully', split });
  } catch (error) {
    console.error("Error updating split status:", error); 
      res.status(500).json({ message: 'Server error', error });
  }
};



//pending approvals
exports.getPendingApprovalsCount = async (req, res) => {
  try {
    const count = await Splits.countDocuments({ status: "Pending" });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: "Error fetching pending approvals", error: err });
  }
};

// Get split details by beneficiary ID
exports.getSplitDetailsByBeneficiary = async (req, res) => {
  try {
    const beneficiaryId = req.params.id;
    const splitDetails = await Splits.find({ beneficiary: beneficiaryId }).populate("beneficiary");

    if (!splitDetails || splitDetails.length === 0) {
      return res.status(404).json({ message: "No split details found for this beneficiary" });
    }

    res.status(200).json(splitDetails);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
//////////////


// Increment notification count
exports.incrementNotification = async (req, res) => {
  try {
    let notification = await Notifications.findOne();

    if (!notification) {
      notification = new Notifications({ notificationcount: 0 });
    }

    notification.notificationcount += 1;
    await notification.save();

    res.status(200).json({ success: true, count: notification.notificationcount });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error incrementing notification count", error });
  }
};

// Get notification count
exports.getNotificationCount = async (req, res) => {
  try {
    const notification = await Notifications.findOne();

    if (!notification) {
      return res.status(200).json({ success: true, count: 0 });
    }

    res.status(200).json({ success: true, count: notification.notificationcount });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error getting notification count", error });
  }
};

// Reset notification count
exports.resetNotificationCount = async (req, res) => {
  try {
    let notification = await Notifications.findOne();

    if (!notification) {
      notification = new Notifications({ notificationcount: 0 });
    }

    notification.notificationcount = 0;
    await notification.save();

    res.status(200).json({ success: true, message: "Notification count reset", count: notification.notificationcount });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error resetting notification count", error });
  }
};
//send a  email to charity

exports.sendEmail = async (req, res) => {
  try {
    const { filename, path: filePath } = req.file;

    // Set up Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send email with the Excel file attachment
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'navaskuniyil6@gmail.com',
      subject: 'Excel Document from Housecare',
      text: 'Please find the attached Excel document.',
      attachments: [
        {
          filename: 'split_details.xlsx',
          path: filePath,
        },
      ],
    });

    // Clean up the uploaded file
    fs.unlinkSync(filePath);

    res.status(200).json({ message: 'Excel file sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send Excel file.' });
  }
};

////transactions
exports.getTransactions = async (req, res) => {
  try {
      const beneficiaryId = req.params.id;

      // Fetch credited details
      const creditedDetails = await Splits.find({ beneficiary: beneficiaryId });

      // Fetch debited details
      const debitedDetails = await Debited.find({ beneficiary: beneficiaryId });

      res.json({
          creditedDetails,
          debitedDetails
      });
  } catch (error) {
      res.status(500).json({ message: "Error fetching transaction details", error });
  }
};