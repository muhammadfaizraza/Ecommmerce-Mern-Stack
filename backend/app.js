const express = require("express");
const app = express();
const errorMiddleware = require("./middleware/error");
const cookieParser = require("cookie-parser");
var session = require("express-session");
app.use(express.json());
app.use(cookieParser("cookie"));
const order = require("./route/orderRoute");
const product = require("./route/productRoute.js");

app.use("/api/v1", order);
app.use("/api/v1", product);

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);

const user = require("./route/userRoute.js");
const bodyParser = require("body-parser");
app.use(
  session({
    secret: "abcdefg",
    resave: true,
    saveUninitialized: false,
    cookie: { secure: true }, // this line
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api/v1", user);
//middleware
app.use(errorMiddleware);

module.exports = app;
