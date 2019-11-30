const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const User = require("../models/users");
const HttpError = require("../models/http-error");

// get user
router.get("/:uid", async (req, res, next) => {
  const reqId = await req.params.uid;
  let user;
  try {
    user = await User.findById(reqId);
  } catch (err) {
    const error = new HttpError("Looking for user failed", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find an user", 404);
    return next(error);
  }

  res.json({ user: user.toObject({ getters: true }) });
});

// get all users
router.get("/", async (req, res, next) => {
  let users;
  try {
    users = await User.find().exec();
  } catch (err) {
    const error = new HttpError("Fetching users failed", 500);
    return next(error);
  }
  res.json({ users: users.map(user => user.toObject({ getters: true })) });
});

// register new user
router.post("/signup", async (req, res, next) => {
  const { name, email, age, description } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Signing up failed", 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError("User exists already", 422);
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    age,
    description
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signing up failed", 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
});

// identify user
router.post("/login", async (req, res, next) => {
  const { name, email } = req.body;

  let identifiedUser;
  try {
    identifiedUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Login failed", 500);
    return next(error);
  }

  if (!identifiedUser || identifiedUser.name !== name) {
    const error = new HttpError("Could not identity user", 401);
    return next(error);
  }

  res.json({ message: "logged in!" });
});

module.exports = router;
