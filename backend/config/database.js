const mongoose = require("mongoose");
const connectdatabase = () => {
  mongoose
    .connect("mongodb://localhost:27017/ecommerce")
    .then(() => console.log("DB Connection Successfull"));
};
module.exports = connectdatabase;
