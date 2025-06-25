const express = require("express");
const authRouter = express.Router();
const { validateRequest } = require("../utils/validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

authRouter.post("/signup", async (req, res) => {
  try {
    validateRequest(req);
    const {
      firstName,
      lastName,
      emailId,
      password,
      age,
      gender,
      skills,
      Bio,
      Image,
    } = req.body;

    const hashPass = await bcrypt.hash(password, 10);

    const user = new User({
      firstName: firstName,
      lastName: lastName,
      emailId: emailId,
      password: hashPass,
      age: age,
      gender: gender,
      skills: skills,
      Bio: Bio,
      Image: Image,
    });
    await user.save();
    res.send("Data inserted Successfully");
  } catch (err) {
    res.status(500).send(`{ERROR} ${err.message}`);
  }
});

authRouter.post("/login/:userid", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!emailId || !password) {
      throw new Error("Email and password are required.");
    }
    const users = await User.findOne({ emailId: emailId });

    if (users == null) {
      throw new Error("Invalid Credentials");
    }
    const isValidPass = await bcrypt.compare(password, users.password);
    if (!isValidPass) {
      throw new Error("Invalid Credentials");
    } else {
      var token = await jwt.sign({ _id: users._id }, "SHHH123", {
        expiresIn: "7d",
      });
      res
        .cookie("token", token, {
          expires: new Date(Date.now() + 8 * 3600000),
        })
        .send("Logged in successfully!");
    }
  } catch (err) {
    res.status(500).send(`{Error} ${err.message}`);
  }
});

authRouter.post("/logout", async (req, res) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .send("Logged out successfully!");
});

module.exports = authRouter;
