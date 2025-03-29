const Charity = require("../model/charity");
const asyncHandler = require("express-async-handler");
const Charitystaffs = require("../model/charitystaff");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const XLSX = require("xlsx");
// const asyncHandler = require("express-async-handler");

exports.create = asyncHandler(async (req, res) => {
  const {
    charity,
    email,
    date,
    arbic,
    CR_NO,
    roles,
    password,
    VAT_REG_NO,
    authorizedperson,
    phone,
    prifix, // Ensure prifix is received in the request body
  } = req.body;
  const image = req.file ? req.file.filename : "";

  try {
    const charitys = await Charity.findOne({ email });
    if (charitys) {
      return res.status(400).json({ invalid: true, message: "Email already exists" });
    }
    
    const charitysphone = await Charity.findOne({ phone });
    if (charitysphone) {
      return res.status(400).json({ invalid: true, message: "Phone number already exists" });
    }

    // Get the latest charityId and generate a new one
    const lastCharity = await Charity.findOne().sort({ _id: -1 }).select("charityId");
    let newIdNumber = 1;

    if (lastCharity && lastCharity.charityId) {
      const lastId = lastCharity.charityId.match(/\d+/g); // Extract numeric part
      if (lastId) {
        newIdNumber = parseInt(lastId[0]) + 1;
      }
    }

    const newCharityId = `CH${newIdNumber.toString().padStart(6, "0")}${prifix}`;

    const newCharity = await Charity.create({
      charity,
      email,
      password,
      date,
      authorizedperson,
      CR_NO,
      roles,
      VAT_REG_NO,
      phone,
      arbic,
      image,
      prifix,
      charityId: newCharityId, // Assign the generated ID
    });

    if (!newCharity) {
      console.log("Charity creation failed");
      return res.status(500).json({ message: "Failed to create charity" });
    }

    res.status(201).json({ message: "Success", charity: newCharity });
  } catch (err) {
    console.log(err, "Creation failed");
    return res.status(400).json({ err: "Something went wrong in charity creation" });
  }
});


exports.list = asyncHandler(async (req, res) => {
  try {
    const charities = await Charity.find();
    if (!charities) {
      console.log("something went wrong in charity list");
      return res
        .status(400)
        .json({ message: "charity listing failed something went wrong" });
    }
    res.json(charities);
  } catch (err) {
    console.log(err, "charity listing failed");
    return res.status(500).json({ err: "charity listing failed" });
  }
});

exports.edit = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const charities = await Charity.findById(id);
    if (!charities) {
      console.log("something went wrong in Edit by Id");
      return res.status(400).json({
        message: "an error occured in edit by Id Can't found the charity",
      });
    }
    res.json(charities);
  } catch (err) {
    console.log(err, "an error occured in edit by Id");
    return res
      .status(500)
      .json({ err: "an error occured in charity details edit by Id" });
  }
});

exports.update = asyncHandler(async (req, res) => {
  const {
    charity,
    email,
    date,
    arbic,
    CR_NO,
    roles,
    VAT_REG_NO,
    authorizedperson,
    prifix,
    phone,
  } = req.body;
  const { id } = req.params;
  try {
    const charities = await Charity.findById(id);
    if (!charities) {
      console.log("charity not found");
      return res.status(400).json({ message: "charity not found to update" });
    }
    // Check if the email already exists for another staff member
    const existingEmail = await Charity.findOne({ email, _id: { $ne: id } });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Check if the phone number already exists for another staff member
    const existingPhone = await Charity.findOne({ phone, _id: { $ne: id } });
    if (existingPhone) {
      return res.status(400).json({ message: "Phone number already exists" });
    }
    charities.email = email;
    // charities.password = password;
    charities.charity = charity;
    charities.date = date;
    charities.phone = phone;
    charities.VAT_REG_NO = VAT_REG_NO;
    charities.CR_NO = CR_NO;
    charities.roles = roles;
    charities.authorizedperson = authorizedperson;
    charities.arbic = arbic;
    charities.prifix = prifix;
    if (req.file) {
      charities.image = req.file.filename;
    }
    const updatecharity = await charities.save();
    res.json({ updatecharity });
  } catch (err) {
    console.log(err, "an error occured in charity updation");
    return res
      .status(500)
      .json({ message: "an error occured in charity updation " });
  }
});

exports.delete = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const charities = await Charity.findById(id);
    if (!charities) {
      console.log("charity not found");
      return res.status(400).json({ message: "charity not found to delete" });
    } else {
      await charities.deleteOne();
      res.json({ message: "delete successfully" });
    }
  } catch (err) {
    console.log(err, "delete failed");
    return res
      .status(500)
      .json({ message: "an error occured in charity delete" });
  }
});


exports.details = asyncHandler(async (req, res) => {
  const { charity } = req.params;
  try {
    const charities = await Charity.findOne({ charity });
    if (!charities) {
      return res.status(400).json({ message: "charity is not found" });
    }
    res.json(charities);
  } catch (err) {
    console.log("an error occured in ", err);
    return res
      .status(500)
      .json({ err: "An error occured in charity organaization details " });
  }
});


exports.signin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await Charitystaffs.findOne({ email: email });
    let isSuperAdmin = false;
    if (!user) {
      user = await Charity.findOne({ email: email });

      if (!user) {
        console.log("User not found");
        return res.status(400).json({ message: "User not found" });
      } else {
        isSuperAdmin = true;
      }
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password not matched");
      return res.status(400).json({ message: "Password not matched" });
    }

    if (user && isMatch) {
      const charitydetails = {
        charity: user.charity,
        email: user.email,
        image: user.image,
        phone: user.phone,
        id: user._id,
        roles: user.roles,
        VAT_REG_NO: user.VAT_REG_NO,
        authorizedperson: user.authorizedperson,
        date: user.date,
        arbic: user.arbic,
        CR_NO: user.CR_NO,
      };

      const token = jwt.sign({ email: user.email }, "myjwtsecretkey");
      user.tokens = token;
      await user.save();
      console.log("Login successful, token generated");
      return res
        .status(200)
        .json({ token: token, charitydetails: charitydetails });
    } else {
      return res.status(400).json({ message: "Password not matched" });
    }
  } catch (err) {
    console.log(err, "Login failed");
    return res.status(500).json({ err: "Login failed" });
  }
});

exports.detailses = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || id === "undefined" ) {
    return res.status(400).json({ message: "Invalid or missing charity ID" });
  }
  
  try {
    const charities = await Charity.findById(id); // Find by ID
    if (!charities) {
      return res.status(400).json({ message: "Charity not found" });
    }
    res.json(charities);
  } catch (err) {
    console.log("An error occurred:", err);
    return res
      .status(500)
      .json({ err: "An error occurred while fetching charity details" });
  }
});

  

//import cahrity
exports.importCharityFromExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("File received:", req.file.originalname);
    console.log("File size:", req.file.size);
    console.log("File mimetype:", req.file.mimetype);

    if (!req.file.buffer || req.file.buffer.length === 0) {
      return res.status(400).json({ message: "Uploaded file is empty" });
    }

    try {
      const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
      console.log("Workbook Sheets:", workbook.SheetNames);

      if (workbook.SheetNames.length === 0) {
        return res.status(400).json({ message: "Excel file has no sheets" });
      }

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      if (jsonData.length === 0) {
        return res.status(400).json({ message: "Excel file is empty or invalid" });
      }

      console.log("Extracted Data:", jsonData);

      // Find existing charities by email or charity name
      const existingCharities = await Charity.find({
        $or: jsonData.map((item) => ({
          email: item.email,
          charity: item.charity,
        })),
      });

      const existingEmails = new Set(existingCharities.map((charity) => charity.email));
      const existingNames = new Set(existingCharities.map((charity) => charity.charity));

      // Find the last charity to determine the next ID number
      const lastCharity = await Charity.findOne().sort({ charityId: -1 });

      let lastNumber = 0;
      if (lastCharity && lastCharity.charityId) {
        const match = lastCharity.charityId.match(/CH(\d+)/);
        if (match && match[1]) {
          lastNumber = parseInt(match[1]);
        }
      }

      const charityData = [];

      // Default image URL (change this to your preferred image link)
const DEFAULT_IMAGE_URL = "https://cdn-icons-png.flaticon.com/512/2922/2922510.png"; 

for (const item of jsonData) {
  if (existingEmails.has(item.email) || existingNames.has(item.charity)) {
    console.log(`Skipping existing charity: ${item.charity} (${item.email})`);
    continue;
  }

  // Required fields
  const requiredFields = ["charity", "prifix", "phone", "authorizedperson", "email", "date", "roles", "password"];
  for (const field of requiredFields) {
    if (!item[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  // Convert date to DD/MM/YYYY format
  const parsedDate = new Date(item.date);
  const formattedDate = parsedDate.toLocaleDateString("en-GB");

  // Hash the password
  const hashedPassword = await bcrypt.hash(item.password, 10);

  // Generate the next sequential ID
  lastNumber++;
  const paddedNumber = String(lastNumber).padStart(6, "0");
  const charityId = `CH${paddedNumber}${item.prifix}`;

  charityData.push({
    charity: item.charity,
    prifix: item.prifix,
    charityId: charityId,
    arbic: item.arbic || "",
    CR_NO: item.CR_NO || "",
    VAT_REG_NO: item.VAT_REG_NO || "",
    phone: item.phone,
    authorizedperson: item.authorizedperson,
    email: item.email,
    date: formattedDate,
    roles: item.roles,
    password: hashedPassword,
    image: item.image || DEFAULT_IMAGE_URL, // Set default image if not provided
  });
}

      // Save data to database
      const importedCharities = await Charity.insertMany(charityData);
      console.log("Import successful, records created:", importedCharities.length);

      res.status(201).json({
        message: "Charities imported successfully", 
        importedCount: importedCharities.length,
        skippedCount: existingCharities.length,
        skippedCharities: existingCharities.map((c) => c.charity),
      });
    } catch (parseError) {
      console.error("Error parsing Excel or processing data:", parseError);
      return res.status(400).json({ message: `Error processing file: ${parseError.message}` });
    }
  } catch (error) {
    console.error("Error importing charities:", error.message);
    console.error(error.stack);
    res.status(500).json({ message: "Internal Server Error", details: error.message });
  }
};



// Update Password by _id
exports.updatePassword = async (req, res) => {
  try {
      const { _id, newPassword } = req.body;

      if (!_id || !newPassword) {
          return res.status(400).json({ message: "Missing required fields" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const updatedCharity = await Charity.findByIdAndUpdate(_id, { password: hashedPassword }, { new: true });

      if (!updatedCharity) {
          return res.status(404).json({ message: "Charity not found" });
      }

      res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
      res.status(500).json({ message: "Error updating password", error });
  }
};