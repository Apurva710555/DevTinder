const express = require("express");
const profileRouter = express.Router();
const { auth } = require("../middlewares/auth");
const User = require("../models/user");
const { validateEditProfileData } = require("../utils/validation");
const bcrypt = require("bcrypt");

profileRouter.get("/profile", auth, async (req, res) => {
  try {
    console.log(req.user);

    res.send(`${req.user[0].firstName} is logged in!! ${req.user}`);
  } catch (err) {
    res.status(500).send(`{Error} ${err.message}`);
  }
});

profileRouter.patch("/profile/edit", auth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Update Request");
    }
    let loggedInUser = req.user;
    Object.keys(req.body).forEach((keys) => {
      loggedInUser[keys] = req.body[keys];
    });
    // console.log();
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName} your profile has been updated sucessfully!`,
      data: loggedInUser,
    });
  } catch (err) {
    res
      .status(500)
      .send(`Error occured while updating the user: ${err.message}`);
  }
});

profileRouter.patch("/profile/password", auth, async (req, res) => {
  try {
    //check if the user is logged in
    const { oldpassword, newpassword } = req.body;
    if (!oldpassword || !newpassword) {
      throw new Error("Invalid update password request");
    }
    const loggedInUser = req.user;
    if (!loggedInUser) throw new Error("User not logged in");
    const isValidPass = await bcrypt.compare(
      oldpassword,
      loggedInUser.password
    );
    if (!isValidPass) throw new Error("Old password doesn't match");
    const hashPass = await bcrypt.hash(newpassword, 10);
    loggedInUser.password = hashPass;
    await loggedInUser.save();
    res
      .cookie("token", null, {
        expires: new Date(Date.now()),
      })
      .json({
        message: "Password Updated Successfully!",
        data: loggedInUser,
      });
  } catch (err) {
    res
      .status(500)
      .send(`Error occured while updating the password: ${err.message}`);
  }
});

module.exports = profileRouter;
