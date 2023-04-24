const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  users: Number,
  phone: String,
  createdAt: { type: Date, default: Date.now },
});

const OTP = mongoose.model("OTP", userSchema);
module.exports = OTP;
