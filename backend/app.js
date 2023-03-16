const express = require("express");
const app = express();
const errorMiddleware = require("./middleware/error");
app.use(express.json());

const product = require("./route/productRoute.js");

app.use("/api/v1", product);

//middleware
app.use(errorMiddleware);

module.exports = app;
