const express = require("express");
const connectDb = require("./config/database");
const User = require("./models/user");
const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.send("Data inserted Successfully");
  } catch (err) {
    res.status(500).send(`Error saving the user: ${err.message}`);
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

app.get("/user", async (req, res) => {
  try {
    const users = await User.findOne({ emailId: req.body.emailId }).exec();
    res.send(users);
  } catch (err) {
    res
      .status(500)
      .send(`Error occured while fetching the user details: ${err.message}`);
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
