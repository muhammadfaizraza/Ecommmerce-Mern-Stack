const app = require("./app.js");

const connectdatabase = require("./config/database.js");

connectdatabase();

//----------------------DotEnv ---------------------//

const dotenv = require("dotenv");
dotenv.config({ path: "config/config.env" });

process.on("uncaughtException", (error) => {
  console.log(`Error,${error.message}`);
  console.log("server is close because some unhandled promise rejection");
  process.exit(1);
});

const server = app.listen(process.env.PORT, () => {
  console.log(`your port is listen on  http://localhost:${process.env.PORT}`);
});

process.on("unhandledRejection", (error) => {
  console.log(`Error,${error.message}`);
  console.log("server is close because some unhandled promise rejection");
  server.close(() => {
    process.exit(1);
  });
});
