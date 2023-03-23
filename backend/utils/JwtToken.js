const sendToken = async (user, statusCode, res) => {
  const token = await user.jwtToken();
  //option for cookie
  const option = {
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 1000),
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", token, option).json({
    success: true,
    user,
    token,
  });
};
module.exports = sendToken;
