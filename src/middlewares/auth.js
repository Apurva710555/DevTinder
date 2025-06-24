const jwt = require("jsonwebtoken");
const User = require("../models/user");
const auth = async (req, res, next) => {
  try {
    const cookie = req.cookies.token;
    if (!cookie) {
      throw new Error("token expired, please login again!");
    }
    var decoded = jwt.verify(cookie, "SHHH123");
    const user = await User.findOne({ _id: decoded._id });
    if (!user) {
      throw new Error("User not found");
    } else {
      req.user = user;
      next();
    }
  } catch (err) {
    res.status(500).send(`{Error} ${err.message}`);
  }
};

module.exports = {
  auth,
};
