const asyncHandler = require("express-async-handler");
const Amount = require("../model/amount");


exports.create = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  
  try {
    if (!amount) {
      return res.status(400).json({ error: "Amount cannot be blank" });
    }
    
    Number(amount);
    console.log(amount);
    
    const newAmount = new Amount({ amount });
    await newAmount.save();

    res.status(201).json({ message: "Amount created successfully", newAmount });
  } catch (err) {
    console.error("Amount creation failed:", err);
    res.status(500).json({ error: "Something went wrong in amount creation" });
  }
});


exports.getAll = asyncHandler(async (req, res) => {
  try {
    const amounts = await Amount.find();
    const totalAmount = amounts.reduce((sum, amount) => sum + amount.amount, 0);

    res.status(200).json({ amounts, totalAmount });
  } catch (err) {
    console.error("Fetching amounts failed:", err);
    res.status(500).json({ error: "Failed to fetch amounts" });
  }
});


exports.getById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const amount = await Amount.findById(id);
    if (!amount) {
      return res.status(404).json({ error: "Amount not found" });
    }
    res.status(200).json({ amount });
  } catch (err) {
    console.error("Fetching amount failed:", err);
    res.status(500).json({ error: "Failed to fetch amount" });
  }
});


exports.update = asyncHandler(async (req, res) => {
  const { amount} = req.body;
  const { id } = req.params;
  
  try {
    if (!amount) {
      return res.status(400).json({ error: "Amount cannot be blank" });
    }

    const updatedAmount = await Amount.findByIdAndUpdate(id, { amount }, { new: true });

    if (!updatedAmount) {
      return res.status(404).json({ error: "Amount not found" });
    }

    res.status(200).json({ message: "Amount updated successfully", updatedAmount });
  } catch (err) {
    console.error("Amount update failed:", err);
    res.status(500).json({ error: "Something went wrong in amount update" });
  }
});


exports.delete = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deletedAmount = await Amount.findByIdAndDelete(id);
    if (!deletedAmount) {
      return res.status(404).json({ error: "Amount not found" });
    }
    res.status(200).json({ message: "Amount deleted successfully" });
  } catch (err) {
    console.error("Amount deletion failed:", err);
    res.status(500).json({ error: "Something went wrong in amount deletion" });
  }
});
