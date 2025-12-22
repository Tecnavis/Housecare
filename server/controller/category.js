const Categorylist = require("../model/categories");
const asyncHandler = require("express-async-handler");

exports.create = asyncHandler(async (req, res) => {
  const {categories } = req.body;

  try {
    const  category = await Categorylist.create({
      categories: categories,
    });
    if (!category) {
      console.log("category creation failed");
      res.send("Failed");
    } else {
      res.send("Success");
    }
  } catch (err) {
    console.log(err, "category creation failed");
    return res
      .status(400)
      .json({ err: "something went wrong in category creation" });
  }
});


exports.list = asyncHandler(async (req, res) => {
	try {
		const category = await Categorylist.find();
		if (!category) {
			console.log('something went wrong in category list');
			return res.status(400).json({ message: 'category listing failed something went wrong' });
		}
		res.json(category);
	} catch (err) {
		console.log(err, 'category listing failed');
		return res.status(500).json({ err: 'category listing failed' });
	}
});


exports.edit = asyncHandler(async (req, res) => {
	const { id } = req.params;
	try {
		const category = await Categorylist.findById(id);
		if (!category) {
			console.log('something went wrong in Edit by Id');
			return res.status(400).json({
				message: "an error occured in edit by Id Can't found the category",
			});
		}
		res.json(category);
	} catch (err) {
		console.log(err, 'an error occured in edit by Id');
		return res.status(500).json({ err: 'an error occured in category details edit by Id' });
	}
});


exports.update = asyncHandler(async (req, res) => {
    const { categories} = req.body;
  const { id } = req.params;
	try {
		const category = await Categorylist.findById(id);
		if (!category) {
			return res.status(400).json({ message: 'Category not found' });
		}
		category.categories = categories;
    
		const updateCategory = await category.save();
		res.json({ updateCategory });
	} catch (err) {
		console.log('an error occured in category updation');
		return res.status(500).json({ err: 'An error occured in category details updation' });
	}
});

exports.delete = asyncHandler(async (req, res) => {
	const { id } = req.params;

	try {
		const category = await Categorylist.findById(id);
		if (!category) {
			console.log('category not found');
			return res.status(400).json({ message: 'category not found to delete' });
		} else {
			await category.deleteOne();
			res.json({ message: 'delete successfully' });
		}
	} catch (err) {
		console.log(err, 'delete failed');
		return res.status(500).json({ message: 'an error occured in Benificiary delete' });
	}
});
