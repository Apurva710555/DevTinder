var validator = require("validator");
const validateRequest = (req) => {
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

  //firstName and LastName validation
  if (!firstName || !lastName || !emailId || !password || !age || !gender) {
    throw new Error("Fields are missing, kindly fill all the required fields");
  }
  if (
    firstName.length < 2 ||
    firstName.length > 50 ||
    lastName.length < 2 ||
    lastName.length > 50
  ) {
    throw new Error("Invalid First Name or Last Name");
  }
  if (!validator.isAlpha(firstName) || !validator.isAlpha(lastName)) {
    throw new Error("Not a valid last name or first name");
  }

  //Email-id validation
  if (!validator.isEmail(emailId)) throw new Error("Invalid email");
  //Password validation
  if (!validator.isStrongPassword(password)) {
    throw new Error("Weak password, please change it!");
  }
  //Gender validation
  const data = ["male", "female", "others"];
  if (!data.includes(gender)) {
    throw new Error("Gender is not valid.");
  }
  //Image validation
  if (Image && !validator.isURL(Image)) {
    throw new Error("Not a valid Image");
  }
  if (age.length < 18) throw new Error("Not valid age.");
};

const validateEditProfileData = (req) => {
  const allowEditFields = ["firstName", "lastName", "gender", "age", "skills"];

  const isValid = Object.keys(req.body).every((field) =>
    allowEditFields.includes(field)
  );
  return isValid;
};
module.exports = { validateRequest, validateEditProfileData };
