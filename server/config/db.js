const mongoose = require('mongoose');
require('dotenv').config();

const dblink = process.env.MONGODB_URI;

function connectDB() {
    mongoose.connect(dblink)
    .then(() => {
        console.log("✅ MongoDB connected successfully");
    })
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err.message);
        process.exit(1); // Exit if DB connection fails
    });
}

module.exports = connectDB;