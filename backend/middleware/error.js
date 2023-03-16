const ErrorHandler = require("../utils/Errorhandler.js");

module.exports = (err, req, res, next) => {
  (err.statusCode = err.statusCode || 500),
    (err.message = err.message || "internal server error");

  if (err.name === "CastError") {
    const message = `Resource not found ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  //------wrong mongo id errorhandling------cast error///
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
