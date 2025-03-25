const Charitystaffs = require('../model/charitystaff');
const asyncHandler = require('express-async-handler');

exports.create = asyncHandler(async (req, res) => {
	const { name, email, phone, password, roles, charity } = req.body;
	// const image = req.file.filename;
	const image = req.file ? req.file.filename : "";

	try {
		const staffs = await Charitystaffs.findOne({ email });
		if (staffs) {
			return res.status(400).json({ invalid: true, message: 'email is already exist' });
		}
		const staffsphone = await Charitystaffs.findOne({ phone });
		if (staffsphone) {
			return res.status(400).json({ invalid: true, message: 'phone number is already exist' });
		}
		const staff = await Charitystaffs.create({
			name: name,
			password: password,
			roles: roles,
			email: email,
			phone: phone,
			charity: charity,
			image: image,
		});
		if (staff) {
			res.send('success');
		} else {
			res.send('Failed');
		}
	} catch (err) {
		console.log('an error occured ', err);
		return res.status(500).json({ err: 'an error occured in Charity staff creation' });
	}
});

exports.list = asyncHandler(async (req, res) => {
	try {
		const staff = await Charitystaffs.find();
		if (!staff) {
			res.send('listing failed');
		}
		res.send(staff);
	} catch (err) {
		console.log('an error occured in staff listing', err);
		return res.status(500).json({ err: 'an error occured staff listing' });
	}
});

exports.edit = asyncHandler(async (req, res) => {
	const { id } = req.params;
	try {
		const staff = await Charitystaffs.findById(id);
		if (!staff) {
			return res.status(400).json({ message: 'Staff not found' });
		}
		res.send(staff);
	} catch (err) {
		console.log('an error occured in data fetching', err);
		return res.status(500).json({ err: 'an error occured in staff details fetching' });
	}
});

exports.update = asyncHandler(async (req, res) => {
	const { name, email, phone, password, roles, charity } = req.body;
	const { id } = req.params;
	try {
		const staff = await Charitystaffs.findById(id);
		if (!staff) {
			return res.status(400).json({ message: 'Staff not found' });
		}
		  // Check if the email already exists for another staff member
		  const existingEmail = await Charitystaffs.findOne({ email, _id: { $ne: id } });
		  if (existingEmail) {
			return res.status(400).json({ message: 'Email already exists' });
		  }
	  
		  // Check if the phone number already exists for another staff member
		  const existingPhone = await Charitystaffs.findOne({ phone, _id: { $ne: id } });
		  if (existingPhone) {
			return res.status(400).json({ message: 'Phone number already exists' });
		  }
		staff.name = name;
		staff.email = email;
		staff.phone = phone;
		staff.password = password;
		staff.roles = roles;
		staff.charity = charity;
		if (req.file) {
			staff.image = req.file.filename;
		}
		const updatestaff = await staff.save();
		res.json({ updatestaff });
	} catch (err) {
		console.log('an error occured in staff updation');
		return res.status(500).json({ err: 'An error occured in staff details updation' });
	}
});
exports.delete = asyncHandler(async (req, res) => {
	const { id } = req.params;
	try {
		const staff = await Charitystaffs.findById(id);
		if (!staff) {
			return res.status(400).json({ message: 'Staff not found' });
		}
		await staff.deleteOne();
		res.json({ message: 'ddelete successfull' });
	} catch (err) {
		console.log('an error occured in data delete');
		return res.status(500).json({ err: 'an error occured in data delete' });
	}
});
//block staff
// exports.block = async (req, res) => {
// 	const { id } = req.params;
// 	try {
// 	  const staff = await Charitystaffs.findById(id);
// 	  if (!staff) {
// 		return res.status(404).json({ message: "Staff not found" });
// 	  }
  
// 	  staff.isBlocked = !staff.isBlocked; 
// 	  await staff.save();
// 	  res.json({ message: "blocked successfull", staff });
// 	} catch (error) {
// 	  console.error("Error in Block Staff:", error);
// 	  res.status(500).json({ message: "Server Error" });
// 	}
//   };
  