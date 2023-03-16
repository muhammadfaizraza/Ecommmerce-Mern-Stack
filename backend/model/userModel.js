const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is Required"],
    maxLength: [30, "Name should have less then 30 characters"],
    minLength: [3, "Name should have more then 3 characters"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please Enter A Email"],
    validate: [validator.isEmail, "Please Enter A Password"],
  },
  password: {
    type: String,
    required: [true, "password is Required"],
    maxLength: [30, "password should have less then 30 characters"],
    minLength: [3, "password should have more then 3 characters"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

module.exports = mongoose.model("user", userSchema);
