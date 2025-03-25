const mongoose = require('mongoose');
require('dotenv').config();

const dblink = process.env.MONGODB_URI;
function connectDB() {
    mongoose.connect(dblink, {})
    .then(() => {
        console.log("Database connected successfully");
        console.log("http://localhost:8000");
    })
    .catch((err) => {
        console.log(err, "error occurred in database connection");
    });
}

module.exports = connectDB;
