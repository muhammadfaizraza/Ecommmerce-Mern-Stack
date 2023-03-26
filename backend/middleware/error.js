const { JsonWebTokenError } = require("jsonwebtoken");
const ErrorHandler = require("../utils/Errorhandler.js");

module.exports = (err, req, res, next) => {
  (err.statusCode = err.statusCode || 500),
    (err.message = err.message || "internal server error");

  if (err.name === "CastError") {
    const message = `Resource not found ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  //Duplication Error in Mongoose
  if ((err.statusCode = 11000)) {
    const message = `Duplicate Entry ${Object.keys(err.keyValue)}`;
    err = new ErrorHandler(message, 400);
  }

  if ((err.name = "JsonWebTokenError")) {
    const message = `Json Web Token is Invalid `;
    err = new ErrorHandler(message, 400);
  }

  if ((err.name = "TokenExpiredError")) {
    const message = `Json Web Token is Expired `;
    err = new ErrorHandler(message, 400);
  }
  //------wrong mongo id errorhandling------cast error///
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
  console.log(err.keyValue);
};
