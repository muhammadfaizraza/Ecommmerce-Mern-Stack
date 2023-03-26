const ErrorHandler = require("../utils/Errorhandler.js");
const catchAsynncErrors = require("../middleware/catchAsyncErrors.js");
const User = require("../model/userModel.js");
const sendToken = require("../utils/JwtToken.js");
const sendEmail = require("../utils/sendEmail.js");
const crypto = require("crypto");
const catchAsyncErrors = require("../middleware/catchAsyncErrors.js");

exports.registerUser = catchAsynncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "simple",
      url: "www",
    },
  });
  sendToken(user, 200, res);
});

exports.loginUser = catchAsynncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Invalid email Password", 401));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email Password ", 401));
  }

  const isMatched = user.MatchedPassword(password);

  if (!isMatched) {
    return next(new ErrorHandler("Invalid Email and Password", 401));
  }
  const token = user.jwtToken();
  sendToken(user, 200, res);
});

exports.logOut = catchAsynncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logout Successfully",
  });
});

exports.forgotPassword = catchAsynncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User Not Found ", 401));
  }
  //Get Reset Password Token
  const resetToken = user.getResetPassword();
  await user.save({ validateBeforeSave: false });

  const resetPasswprdUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your Password reset token is :- \n \n ${resetPasswprdUrl}
  click to reset your password
  
  `;
  try {
    sendEmail({
      email: user.email,
      subject: "Ecommerce Password Protocol",
      message: message,
    });

    res.status(200).json({
      success: true,
      message: `Email is Sended to ${user.email} this email Address`,
    });
  } catch (error) {
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    user.save({ validateBeforeSave: false });
  }
});

exports.resetPassword = catchAsynncErrors(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new ErrorHandler("User is Not Found or Token Has Been Expired", 404)
    );
  }
  if (req.body.password !== req.body.confirmPassword) {
    new ErrorHandler("Password is Not Matched", 404);
  }

  user.password = req.body.password;
  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;

  await user.save();
  sendToken(user, 200, res);
});

exports.getuserDetail = catchAsyncErrors(async (req, res, next) => {
  const users = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    users,
  });
});

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  const isMatched = user.MatchedPassword(req.body.oldPassword);

  if (!isMatched) {
    return next(new ErrorHandler("Invalid Email and Password", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password is Incorrect", 400));
  }

  user.password = req.body.newPassword;

  await user.save();
  sendToken(user, 200, res);
});

exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newProfile = {
    name: req.body.name,
    email: req.body.email,
  };
  const user = User.findByIdAndUpdate(req.user.id, newProfile, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    user,
  });
});
