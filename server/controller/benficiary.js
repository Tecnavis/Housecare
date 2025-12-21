const Benificiaries = require("../model/benificiary");
const Charity = require("../model/charity");
const asyncHandler = require("express-async-handler");
const Debited = require("../model/debited");
const xlsx = require("xlsx");

/* ======================================================
   CREATE BENEFICIARY (FIXED)
====================================================== */
exports.create = asyncHandler(async (req, res) => {
  const charityId = req.user.id;

  const charity = await Charity.findById(charityId);
  if (!charity) {
    return res.status(400).json({ message: "Invalid charity" });
  }

  const { email_id, number } = req.body;

  if (await Benificiaries.findOne({ email_id })) {
    return res.status(400).json({ message: "Email already exists" });
  }

  if (await Benificiaries.findOne({ number })) {
    return res.status(400).json({ message: "Phone number already exists" });
  }

  await Benificiaries.create({
    ...req.body,
    charity_id: charityId,
    charity_name: charity.charity
  });

  res.json({ message: "Beneficiary created successfully" });
});

/* ======================================================
   LIST BENEFICIARIES (MAIN FIX)
====================================================== */
exports.list = asyncHandler(async (req, res) => {
  const { id, role } = req.user;

  const filter = role === "admin" ? {} : { charity_id: id };

  const beneficiaries = await Benificiaries.find(filter);
  res.json(beneficiaries);
});

/* ======================================================
   EDIT (VIEW SINGLE) — OWNERSHIP FIX
====================================================== */
exports.edit = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const beneficiary = await Benificiaries.findOne({
    _id: id,
    charity_id: req.user.role === "admin" ? { $exists: true } : req.user.id
  });

  if (!beneficiary) {
    return res.status(403).json({ message: "Access denied" });
  }

  res.json(beneficiary);
});

/* ======================================================
   UPDATE — OWNERSHIP FIX
====================================================== */
exports.update = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const beneficiary = await Benificiaries.findOne({
    _id: id,
    charity_id: req.user.id
  });

  if (!beneficiary) {
    return res.status(403).json({ message: "Access denied" });
  }

  if (
    req.body.email_id &&
    await Benificiaries.findOne({ email_id: req.body.email_id, _id: { $ne: id } })
  ) {
    return res.status(400).json({ message: "Email already exists" });
  }

  if (
    req.body.number &&
    await Benificiaries.findOne({ number: req.body.number, _id: { $ne: id } })
  ) {
    return res.status(400).json({ message: "Phone number already exists" });
  }

  Object.assign(beneficiary, req.body);
  await beneficiary.save();

  res.json({ message: "Updated successfully", beneficiary });
});

/* ======================================================
   DELETE — OWNERSHIP FIX
====================================================== */
exports.delete = asyncHandler(async (req, res) => {
  const beneficiary = await Benificiaries.findOne({
    _id: req.params.id,
    charity_id: req.user.id
  });

  if (!beneficiary) {
    return res.status(403).json({ message: "Access denied" });
  }

  await beneficiary.deleteOne();
  res.json({ message: "Deleted successfully" });
});

/* ======================================================
   UPDATE BALANCE — OWNERSHIP FIX
====================================================== */
exports.updateBeneficiaryBalance = asyncHandler(async (req, res) => {
  const beneficiary = await Benificiaries.findOne({
    _id: req.params.id,
    charity_id: req.user.id
  });

  if (!beneficiary) {
    return res.status(403).json({ message: "Access denied" });
  }

  beneficiary.Balance = req.body.Balance;
  await beneficiary.save();

  res.json(beneficiary);
});

/* ======================================================
   BULK BALANCE UPDATE — SAFE
====================================================== */
exports.updateBalances = asyncHandler(async (req, res) => {
  const { balanceUpdates } = req.body;

  await Promise.all(
    balanceUpdates.map(update =>
      Benificiaries.updateOne(
        { _id: update.beneficiaryId, charity_id: req.user.id },
        { $inc: { Balance: update.newBalance } }
      )
    )
  );

  res.json({ message: "Balances updated successfully" });
});

/* ======================================================
   EXCEL IMPORT — FIXED (NO DATA LEAK)
====================================================== */
exports.importBenificiariesFromExcel = asyncHandler(async (req, res) => {
  const charityId = req.user.id;

  const charity = await Charity.findById(charityId);
  if (!charity) {
    return res.status(400).json({ message: "Invalid charity" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
  const sheet = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

  const beneficiaries = sheet.map(row => ({
    ...row,
    charity_id: charityId,
    charity_name: charity.charity
  }));

  await Benificiaries.insertMany(beneficiaries, { ordered: false });

  res.json({ message: "Excel imported successfully" });
});

/* ======================================================
   BLOCK / UNBLOCK — OWNERSHIP FIX
====================================================== */
exports.block = asyncHandler(async (req, res) => {
  const beneficiary = await Benificiaries.findOne({
    _id: req.params.id,
    charity_id: req.user.id
  });

  if (!beneficiary) {
    return res.status(403).json({ message: "Access denied" });
  }

  beneficiary.isBlocked = !beneficiary.isBlocked;
  beneficiary.account_status = beneficiary.isBlocked ? "Inactive" : "Active";

  await beneficiary.save();
  res.json(beneficiary);
});

/* ======================================================
   DEBIT RECORD (UNCHANGED)
====================================================== */
exports.createDebitedRecord = asyncHandler(async (req, res) => {
  const debited = await Debited.create(req.body);
  res.status(201).json(debited);
});
