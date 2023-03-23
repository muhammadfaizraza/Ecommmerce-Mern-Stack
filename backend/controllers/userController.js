const ErrorHandler = require("../utils/Errorhandler.js");
const catchAsynncErrors = require("../middleware/catchAsyncErrors.js");
const User = require("../model/userModel.js");
const sendToken = require("../utils/JwtToken.js");
const sendEmail = require("../utils/sendEmail.js");

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
    await sendEmail({
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
