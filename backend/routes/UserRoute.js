const express = require("express");
const asyncHandler = require("express-async-handler");
const generateToken = require("../utils/generateToken");
const User = require("../Models/UserModel");
const { protect } = require("../middleware/Auth");


const userRouter = express.Router();

// get user profile
userRouter.get(
  "/me",
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        email: user.email,
        createdAt: user.createdAt,
      });
    } else {
      res.status(404);
      throw new Error("User Not Found");
    }
  })
);

// login
userRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    // console.log(req.body);
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        email: user.email,
        token: generateToken(user._id),
        createdAt: user.createdAt,
      });
    } else {
      res.status(401);
      throw new Error("Invalid Email or Password");
    }
  })
);

// register
userRouter.post(
  "/register",
  asyncHandler(async (req, res) => {
    const {  email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }
    const user = await User.create({
      email,
      password,
    });
    if (user) {
      res.status(201).json({
        _id: user._id,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalidate user data");
    }
  })
);

module.exports = userRouter;