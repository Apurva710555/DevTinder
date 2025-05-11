const express = require("express");
const  connectDb  = require("./config/database");
const User = require("./models/user")
const app = express();

app.post("/signup", (req,res)=>{
    console.log(JSON.stringify(req.body));
    const user = new User({
        firstName:"Pradnya",
        lastName:"Muthaye",
        emailId:"amuthaye123@gmail.com",
        password:"Pradnya@3101",
        age:26,
        gender:"female"
    })
    user.save();
    res.send("Data inserted Successfully")
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
