const Benificiaries = require("../model/benificiary");
const Charity = require("../model/charity");
const asyncHandler = require("express-async-handler");
const Debited = require("../model/debited");
const xlsx = require("xlsx");

// ✅ CREATE
exports.create = asyncHandler(async (req, res) => {
  const {
    benificiary_name,
    date,
    category,
    age,
    charity_name,
    email_id,
    number,
    nationality,
    sex,
    health_status,
    marital,
    navision_linked_no,
    physically_challenged,
    family_members,
    account_status,
    Balance,
  } = req.body;

  try {
    const benificiaries = await Benificiaries.findOne({ email_id });
    if (benificiaries) {
      return res.status(400).json({ invalid: true, message: "email is already exist" });
    }

    const benificiariesphone = await Benificiaries.findOne({ number });
    if (benificiariesphone) {
      return res.status(400).json({ invalid: true, message: "phone number is already exist" });
    }

    const charities = await Benificiaries.create({
      charity_name: charity_name,
      email_id: email_id,
      benificiary_name: benificiary_name,
      category: category,
      date: date,
      age: age,
      number: number,
      nationality: nationality,
      sex: sex,
      health_status: health_status,
      marital: marital,
      navision_linked_no: navision_linked_no,
      physically_challenged: physically_challenged,
      Balance: Balance,
      account_status: account_status,
      family_members: family_members,
    });

    if (!charities) {
      console.log("benificiary creation failed");
      return res.status(400).send("Failed");
    }

    return res.send("Success");
  } catch (err) {
    console.log(err, "benificiary creation failed");
    return res.status(400).json({ err: "something went wrong in benificiary creation" });
  }
});


// ✅ LIST (FIXED PROPERLY WITH CHARITY ROLE FILTER)
exports.list = asyncHandler(async (req, res) => {
  try {
    let filter = {};

    // ✅ if Charity role → filter based on charity_name
    if (req.admin?.role === "Charity" || req.admin?.role === "CharityStaff") {
      if (!req.admin?.charity_name) {
        return res.status(401).json({ message: "Charity not linked with your account" });
      }

      filter = { charity_name: req.admin.charity_name };
    }

    const beneficiaries = await Benificiaries.find(filter).sort({ createdAt: -1 });
    return res.status(200).json(beneficiaries);
  } catch (err) {
    console.log(err, "benificiary listing failed");
    return res.status(500).json({ err: "benificiary listing failed" });
  }
});


// ✅ EDIT
exports.edit = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const charities = await Benificiaries.findById(id);
    if (!charities) {
      console.log("something went wrong in Edit by Id");
      return res.status(400).json({
        message: "an error occured in edit by Id Can't found the benificiary",
      });
    }
    res.json(charities);
  } catch (err) {
    console.log(err, "an error occured in edit by Id");
    return res.status(500).json({ err: "an error occured in benificiary details edit by Id" });
  }
});


// ✅ UPDATE
exports.update = asyncHandler(async (req, res) => {
  const {
    benificiary_name,
    category,
    date,
    age,
    charity_name,
    email_id,
    number,
    nationality,
    sex,
    health_status,
    marital,
    navision_linked_no,
    physically_challenged,
    family_members,
    account_status,
    Balance,
  } = req.body;

  const { id } = req.params;

  try {
    const charity = await Benificiaries.findById(id);
    if (!charity) {
      return res.status(400).json({ message: "benificiary not found" });
    }

    const existingEmail = await Benificiaries.findOne({ email_id, _id: { $ne: id } });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const existingPhone = await Benificiaries.findOne({ number, _id: { $ne: id } });
    if (existingPhone) {
      return res.status(400).json({ message: "Phone number already exists" });
    }

    charity.benificiary_name = benificiary_name;
    charity.category = category;
    charity.age = age;
    charity.email_id = email_id;
    charity.number = number;
    charity.marital = marital;
    charity.date = date;
    charity.charity_name = charity_name;
    charity.sex = sex;
    charity.nationality = nationality;
    charity.health_status = health_status;
    charity.navision_linked_no = navision_linked_no;
    charity.account_status = account_status;
    charity.Balance = Balance;
    charity.physically_challenged = physically_challenged;
    charity.family_members = family_members;

    const updateBenificiary = await charity.save();
    res.json({ updateBenificiary });
  } catch (err) {
    console.log("an error occured in Benificiary updation");
    return res.status(500).json({ err: "An error occured in Benificiary details updation" });
  }
});


// ✅ DELETE
exports.delete = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const charities = await Benificiaries.findById(id);
    if (!charities) {
      console.log("Benificiary not found");
      return res.status(400).json({ message: "Benificiary not found to delete" });
    } else {
      await charities.deleteOne();
      res.json({ message: "delete successfully" });
    }
  } catch (err) {
    console.log(err, "delete failed");
    return res.status(500).json({ message: "an error occured in Benificiary delete" });
  }
});


// ✅ UPDATE BALANCE
exports.updateBeneficiaryBalance = async (req, res) => {
  try {
    const { id } = req.params;
    const { Balance } = req.body;

    const beneficiary = await Benificiaries.findById(id);
    if (!beneficiary) {
      return res.status(404).send("Beneficiary not found");
    }

    beneficiary.Balance = Balance;
    await beneficiary.save();

    res.send(beneficiary);
  } catch (error) {
    res.status(500).send("Error updating beneficiary balance");
  }
};


// ✅ CREATE DEBITED RECORD
exports.createDebitedRecord = async (req, res) => {
  try {
    const { debitedAmount, debitedDate, transactionId, beneficiary } = req.body;

    const newDebited = new Debited({
      debitedAmount,
      debitedDate,
      transactionId,
      beneficiary,
    });

    await newDebited.save();
    res.status(201).json(newDebited);
  } catch (error) {
    console.error("Error creating debited record:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ UPDATE BENEFICIARY (DEBITED/BALANCE)
exports.updateBeneficiary = async (req, res) => {
  try {
    const { id } = req.params;
    const { debitedAmount, debitedDate, Balance } = req.body;

    const updatedBeneficiary = await Benificiaries.findByIdAndUpdate(
      id,
      { debitedAmount, debitedDate, Balance },
      { new: true }
    );

    if (!updatedBeneficiary) {
      return res.status(404).send("Beneficiary not found");
    }

    res.json(updatedBeneficiary);
  } catch (err) {
    res.status(500).send(err.message);
  }
};


// ✅ BALANCE UPDATE (SPLITTED)
exports.updateBalances = async (req, res) => {
  try {
    const { balanceUpdates } = req.body;

    await Promise.all(
      balanceUpdates.map(async (update) => {
        const beneficiary = await Benificiaries.findById(update.beneficiaryId);

        if (beneficiary && (beneficiary.Balance === null || beneficiary.Balance === undefined)) {
          await Benificiaries.updateOne(
            { _id: update.beneficiaryId },
            { $set: { Balance: 0 } }
          );
        }

        await Benificiaries.updateOne(
          { _id: update.beneficiaryId },
          { $inc: { Balance: update.newBalance } }
        );
      })
    );

    res.status(200).json({ message: "Balances updated successfully" });
  } catch (error) {
    console.error("Error updating balances:", error);
    res.status(500).json({ message: "Error updating balances" });
  }
};


// ✅ IMPORT BENEFICIARIES FROM EXCEL (KEEP AS IT IS)
exports.importBenificiariesFromExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (!sheetData.length) {
      return res.status(400).json({ error: "Empty Excel file" });
    }

    const existingBeneficiaries = await Benificiaries.find({}, "benificiary_id email_id");
    const existingBeneficiaryIds = new Set(existingBeneficiaries.map((b) => b.benificiary_id));
    const existingEmails = new Set(
      existingBeneficiaries.filter((b) => b.email_id).map((b) => b.email_id)
    );

    const allCharities = await Charity.find({});
    const charityMap = new Map();

    allCharities.forEach((charity) => {
      charityMap.set(charity.charity, {
        id: charity._id,
        prefix: charity.prifix,
      });
    });

    const nextIdMap = new Map();
    const beneficiariesToInsert = [];
    const errors = [];

    for (const [index, b] of sheetData.entries()) {
      if (!b.charity_name) {
        errors.push(`Row ${index + 2}: Missing charity name`);
        continue;
      }

      if (b.email_id && existingEmails.has(b.email_id)) {
        errors.push(`Row ${index + 2}: Duplicate email: ${b.email_id}`);
        continue;
      }

      const charityInfo = charityMap.get(b.charity_name);
      if (!charityInfo) {
        errors.push(`Row ${index + 2}: Charity '${b.charity_name}' not found!`);
        continue;
      }

      const charityPrefix = charityInfo.prefix;
      if (!charityPrefix) {
        errors.push(`Row ${index + 2}: Prefix not found for charity '${b.charity_name}'`);
        continue;
      }

      if (!nextIdMap.has(charityPrefix)) {
        const existingIds = Array.from(existingBeneficiaryIds)
          .filter((id) => id.startsWith(charityPrefix))
          .map((id) => parseInt(id.substring(charityPrefix.length), 10))
          .filter((num) => !isNaN(num));

        const highestId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
        nextIdMap.set(charityPrefix, highestId + 1);
      }

      let nextId = nextIdMap.get(charityPrefix);
      const newBeneficiaryId = `${charityPrefix}${nextId.toString().padStart(5, "0")}`;
      nextIdMap.set(charityPrefix, nextId + 1);

      existingBeneficiaryIds.add(newBeneficiaryId);
      if (b.email_id) existingEmails.add(b.email_id);

      beneficiariesToInsert.push({
        benificiary_id: newBeneficiaryId,
        benificiary_name: b.benificiary_name || "",
        number: b.number || "",
        email_id: b.email_id || "",
        charity_name: b.charity_name || "",
        nationality: b.nationality || "",
        sex: b.sex || "",
        health_status: b.health_status || "",
        marital: b.marital || "",
        navision_linked_no: b.navision_linked_no || "",
        physically_challenged: b.physically_challenged || "",
        family_members: b.family_members || 0,
        account_status: b.account_status || "",
        Balance: b.Balance || 0,
        category: b.category || "",
        age: b.age || 0,
      });
    }

    if (beneficiariesToInsert.length === 0) {
      return res.status(400).json({
        error: "No new beneficiaries to insert",
        details: errors.length > 0 ? errors : undefined,
      });
    }

    await Benificiaries.insertMany(beneficiariesToInsert, { ordered: false });

    return res.status(200).json({
      message: `${beneficiariesToInsert.length} beneficiaries imported successfully`,
      errors: errors.length > 0 ? errors : undefined,
      successCount: beneficiariesToInsert.length,
      errorCount: errors.length,
    });
  } catch (error) {
    console.error("Error importing beneficiaries:", error);
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};


// ✅ BLOCK / UNBLOCK BENEFICIARY
exports.block = async (req, res) => {
  const { id } = req.params;
  try {
    const benificiary = await Benificiaries.findById(id);

    if (!benificiary) {
      return res.status(404).json({ message: "Benificary not found" });
    }

    benificiary.isBlocked = !benificiary.isBlocked;
    benificiary.account_status = benificiary.isBlocked ? "Inactive" : "Active";

    await benificiary.save();
    res.json(benificiary);
  } catch (error) {
    console.error("Error in Block benificary:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
