const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//built in module
const crypto = require("crypto");

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

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  // password hshing in this function 10 is power of strongness oof hash
  this.password = await bcrypt.hash(this.password, 10);
});

//jwt token
userSchema.methods.jwtToken = async function () {
  return await jwt.sign({ id: this._id }, process.env.JWT_SECRETS, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};
userSchema.methods.MatchedPassword = async function (enteredpassword) {
  return await bcrypt.compare(enteredpassword, this.password);
};

userSchema.methods.getResetPassword = async function () {
  //Generating Token

  const resetToken = crypto.randomBytes(20).toString("Hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 1 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("user", userSchema);
