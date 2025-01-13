const Jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../Models/UserModel.js");

const protect = asyncHandler(async (req, res, next) => {
  const auth = req.headers.authorization;
  let token;
  if (auth) {
    try {
      token = auth;
      const decoded = Jwt.verify(auth, process.env.JWT_SECRET);
      console.log({decoded});
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.error("Not Authorized, token failed");
      res.status(401);
      throw new Error("Not Authorized, No Token");
    }
  }
  if (!token) {
    res.status(401);
    throw new Error("Not Authorized, No Token");
  }
});
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Not Authorized as an admin");
  }
};
module.exports =  { protect, admin };
