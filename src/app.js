const express = require("express");
const connectDb = require("./config/database");
const User = require("./models/user");
const validateRequest = require("./utils/validation");
const bcrypt = require("bcrypt");
const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
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

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res
      .status(500)
      .send(`Error occured while loading the feed: ${err.message}`);
  }
});

app.post("/login", async (req, res) => {
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
      res.send("Logged in successfully!");
    }
  } catch (err) {
    res.status(500).send(`{Error} ${err.message}`);
  }
});

app.delete("/removeUser", async (req, res) => {
  try {
    await User.findByIdAndDelete({
      _id: "6820abdad8008761dfc19a41",
    });
    res.send("User Deleted Successfully.");
  } catch (err) {
    res
      .status(500)
      .send(`Error occured while removing the user: ${err.message}`);
  }
});

app.patch("/updateUser/:userId", async (req, res) => {
  try {
    const invalidUpdate = ["emailId", "password", "gender", "age"];
    const keys = Object.keys(req.body);
    const includesUpdate = keys.some((k) => invalidUpdate.includes(k));
    if (includesUpdate) throw new Error("This field can't be updated");
    console.log(req.params);
    await User.findByIdAndUpdate(req.params.userId, req.body);
    res.send("User Updated Successfully.");
  } catch (err) {
    res
      .status(500)
      .send(`Error occured while updating the user: ${err.message}`);
  }
});

connectDb()
  .then(() => {
    console.log("Connection was established successfully!");
    app.listen(8080, () => {
      console.log("Listening to port 8080!!!!");
    });
  })
  .catch((err) => {
    console.error("Connection could not be established : (");
  });
