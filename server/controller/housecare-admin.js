const asyncHandler = require("express-async-handler");
const Staffs = require("../model/housecare-model");
const Superadmin = require("../model/housecareadmin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//create new staff
exports.create = asyncHandler(async (req, res) => {
  const { staff, email, password,iqama,phone,role } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    const admins = await Staffs.findOne({ email });
    if (admins) {
      return res
        .status(400)
        .json({ invalid: true, message: "email is already exist" });
    }

    const adminphone = await Staffs.findOne({ phone });
    if (adminphone) {
      return res
        .status(400)
        .json({ invalid: true, message: "phone number is already exist" });
    }
    const admin = await Staffs.create({
      staff: staff,
      password: password,
      email: email,
      role: role,
      iqama:iqama,
      phone:phone,
      image: image,
    });
    if (!admin) {
      console.log("Admin creation failed");
      res.send("Failed");
    } else {
      res.send("Success");
    }
  } catch (err) {
    console.log(err, "craetion failed");
    return res
      .status(400)
      .json({ err: "something went wrong in Admin creation" });
  }
});
//staff login 
// exports.signin = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const admin = await Staffs.findOne({ email: email });
//     if (!admin) {
//       console.log("Admin not found with email:", email);
//       return res
//         .status(400)
//         .json({ invalid: true, message: "Invalid email or password" });
//     }
//     if (admin.isBlocked) {
//       console.log("Account is blocked for email:", email);
//       return res
//         .status(403)
//         .json({ invalid: true, message: "Your account is blocked. Please contact support." });
//     }
//     const isPasswordIsMatch = await bcrypt.compare(password, admin.password);
//     if (admin && isPasswordIsMatch) {
//       const HomecareAdmin = {
//         staff: admin.staff,
//         email: admin.email,
//         image: admin.image,
//         iqama:admin.iqama,
//         phone:admin.phone,
//         role:admin.role
//       };
//       // const roles = admin.role
//       const token = jwt.sign({ email: admin.email }, "myjwtsecretkey");
//       admin.tokens = token;
//       await admin.save();
//       console.log("Signin successful, token generated");
//       res.status(200).json({ token: token, HomecareAdmin: HomecareAdmin });
//     }else {
//       console.log("Password mismatch for email:", email);
//       return res.status(400).json({ invalid: true, message: "Invalid email or password" });
//     }
//   } catch (err) {
//     console.log(err, "signin  failed");
//     return res.status(500).json({ err: "Invalid email or password" });
//   }
// });


exports.signin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    let admin = await Staffs.findOne({ email: email });
    let isSuperAdmin = false;

    if (!admin) {
      console.log("Admin not found in Staffs model with email:");

      admin = await Superadmin.findOne({ email: email });
      if (!admin) {
        console.log("Admin not found in Superadmin model with email:", );
        return res
          .status(400)
          .json({ invalid: true, message: "Invalid email or password" });
      } else {
        isSuperAdmin = true;
      }
    }

    if (admin.isBlocked) {
      console.log("Account is blocked for email:", );
      return res
        .status(403)
        .json({ invalid: true, message: "Your account is blocked. Please contact support." });
    }

    const isPasswordIsMatch = await bcrypt.compare(password, admin.password);
    if (isPasswordIsMatch && admin) {
      const HomecareAdmin = {
        staff: admin.staff,
        email: admin.email,
        image: admin.image,
        iqama: admin.iqama,
        phone: admin.phone,
        role: admin.role,
        id:admin._id
      };

      const token = jwt.sign({ email: admin.email }, "myjwtsecretkey");
      admin.tokens = token;
      await admin.save();      
      console.log("Signin successful, token generated");
      return res.status(200).json({ token: token, HomecareAdmin: HomecareAdmin });
    } else {
      console.log("Password mismatch for email:",);
      return res.status(400).json({ invalid: true, message: "Invalid email or password" });
    }
  } catch (err) {
    console.log(err, "signin failed");
    return res.status(500).json({ err: "Server error" });
  }
});
//list staff details
exports.list = asyncHandler(async (req, res) => {
  try {
    const admin = await Staffs.find();
    if (!admin) {
      console.log("something went wrong in admin list");
      return res
        .status(400)
        .json({ message: "admin listing failed something went wrong" });
    }
    res.json(admin);
  } catch (err) {
    console.log(err, "admin listing failed");
    return res.status(500).json({ err: "Admin listing failed" });
  }
});
//edit by id staff details
exports.edit = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const admin = await Staffs.findById(id);
    if (!admin) {
      console.log("something went wrong in Edit by Id");
      return res.status(400).json({
        message: "an error occured in edit by Id Can't found the admin",
      });
    }
    res.json(admin);
  } catch (err) {
    console.log(err, "an error occured in edit by Id");
    return res
      .status(500)
      .json({ err: "an error occured in Admin details edit by Id" });
  }
});
//update staff details
exports.update = asyncHandler(async (req, res) => {
  const { staff, email ,iqama,phone,role} = req.body;
  const { id } = req.params;
  
  try {
   
    const admin = await Staffs.findById(id);
    if (!admin) {
      console.log("admin not found");
      return res.status(400).json({ message: "Admin not found to update" });
    }
      // Check if the email already exists for another staff member
      const existingStaff = await Staffs.findOne({ email, _id: { $ne: id } });
      if (existingStaff) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Check if the phone number already exists for another staff member
      const existingPhone = await Staffs.findOne({ phone, _id: { $ne: id } });
      if (existingPhone) {
        return res.status(400).json({ message: "Phone number already exists" });
      }
    admin.email = email;
    admin.role = role;
    // admin.password = password;
    admin.staff = staff;
    admin.iqama = iqama;
    admin.phone =phone;
    if (req.file) {
      admin.image = req.file.filename;
    }
    const updateAdmin = await admin.save();
    res.json({ updateAdmin });
  } catch (err) {
    console.log(err, "an error occured in admin updation");
    return res
      .status(500)
      .json({ message: "an error occured in admin updation " });
  }
});

//delete staff
exports.delete = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const admin = await Staffs.findById(id);
    if (!admin) {
      console.log("admin not found");
      return res.status(400).json({ message: "Admin not found to delete" });
    } else {
      await admin.deleteOne();
      res.json({ message: "delete successfully" });
    }
  } catch (err) {
    console.log(err, "delete failed");
    return res
      .status(500)
      .json({ message: "an error occured in admin delete" });
  }
});

//revok staff
exports.block = async (req, res) => {
  const {id} = req.params;
  try {
    const staff = await Staffs.findById(id);
    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    staff.isBlocked = !staff.isBlocked; 
    await staff.save();
    res.json(staff);
  } catch (error) {
    console.error("Error in Block Staff:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
