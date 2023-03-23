const express = require("express");
const app = express();
const errorMiddleware = require("./middleware/error");
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());

const product = require("./route/productRoute.js");

app.use("/api/v1", product);

const user = require("./route/userRoute.js");
app.use("/api/v1", user);
//middleware
app.use(errorMiddleware);

module.exports = app;
