import express from 'express';

import User from '../models/users';
import HttpError from '../models/http-error';

export const router = express.Router();

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

// update user
router.patch("/:uid", async (req, res, next) => {
  const { name, language, pass } = req.body;
  const userId = req.params.uid;

  let user : any;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError("Could not update user", 500);
    return next(error);
  }

  user.name = name;
  user.pass = pass;
  user.language = language;

  try {
    await user.save();
  } catch (err) {
    const error = new HttpError("User updade failed", 500);
    return next(error);
  }

  res.status(200).json({ user: user.toObject({ getters: true }) });
});

// delete user
router.delete("/:uid", async (req, res, next) => {
  const userId = req.params.uid;

  let user : any;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError("Could not delete user", 500);
    return next(error);
  }

  try {
    await user.remove();
  } catch (err) {
    const error = new HttpError("Delete user failed", 500);
    return next(error);
  }

  res.status(200).json({ message: "Deleted user." });
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
  res.json({ users: users.map((user: { toObject: (arg0: { getters: boolean; }) => any; }) => user.toObject({ getters: true })) });
});

// register new user
router.post("/signup", async (req, res, next) => {
  const { name, email, pass, language } = req.body;

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
    pass,
    language: 'de',
    customers: []
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
  const { pass, email } = req.body;

  let identifiedUser: any;
  try {
    identifiedUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Login failed", 500);
    return next(error);
  }

  if (!identifiedUser || identifiedUser.pass !== pass) {
    const error = new HttpError("Could not identity user", 401);
    return next(error);
  }

  res.json({ message: "logged in!", user: identifiedUser.toObject({ getters: true }) });
  
});