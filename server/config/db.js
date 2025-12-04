const mongoose = require('mongoose');
require('dotenv').config();

const dblink = process.env.MONGODB_URI;

function connectDB() {
    mongoose.connect(dblink)
    .then(() => {
        console.log("✅ Database connected successfully");
        
        // Don't log localhost URL in production
        if (process.env.NODE_ENV === 'development') {
            console.log("http://localhost:8000");
        } else {
            console.log("🌐 Production server ready");
        }
    })
    .catch((err) => {
        console.error("❌ Database connection error:", err.message);
        console.log("Error occurred in database connection");
    });
}

module.exports = connectDB;