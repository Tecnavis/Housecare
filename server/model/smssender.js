const mongoose = require("mongoose");

const smssenderSchema = mongoose.Schema({
    phone:{type:Number,required:true,  unique: true }

});

const Smssender = mongoose.model("Smssender", smssenderSchema);
module.exports = Smssender;