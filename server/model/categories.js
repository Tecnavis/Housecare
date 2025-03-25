const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
 categories: { type: String, required: true },
});

const Categories = mongoose.model("Categories", categorySchema);
module.exports = Categories;
