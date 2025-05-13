const mongoose = require("mongoose");
const { Schema } = mongoose;
var validator = require("validator");
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 14,
      validate: (v) => {
        if (!validator.isAlpha(v)) {
          throw new Error("Not a valid first name.");
        }
      },
    },
    lastName: {
      type: String,
      minlength: 2,
      maxlength: 14,
      validate: (v) => {
        if (!validator.isAlpha(v)) {
          throw new Error("Not a valid last name.");
        }
      },
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      validate: (v) => {
        if (!validator.isEmail(v)) {
          throw new Error("Not a valid Email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      // validate: (v) => {
      //   if (!validator.isStrongPassword(v)) {
      //     throw new Error("Weak password, please change it!");
      //   }
      // },
    },
    age: {
      type: Number,
      required: true,
      min: 16,
    },
    gender: {
      type: String,
      required: true,
      validate: function (v) {
        const data = ["male", "female", "others"];
        if (!data.includes(v)) {
          throw new Error("Gender is not valid.");
        }
      },
    },
    skills: {
      type: [String],
    },
    Bio: {
      type: String,
    },
    Image: {
      type: String,
      validate: (v) => {
        if (!validator.isURL(v)) {
          throw new Error("Not a valid Image");
        }
      },
    },
  },
  { timestamps: true } // for every post on db this will push created by and updated by by default.
);

module.exports = mongoose.model("User", userSchema);
