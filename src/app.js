const express = require("express");
const connectDb = require("./config/database");
var cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routers/auth");
const profileRouter = require("./routers/profile");

app.use("/", authRouter);
app.use("/", profileRouter);

connectDb()
  .then(() => {
    console.log("Connection was established successfully!");
    app.listen(8080, () => {
      console.log("Listening to port 8080!!!!");
    });
  })
  .catch((err) => {
    console.error("Connection could not be established : (" + err);
  });
