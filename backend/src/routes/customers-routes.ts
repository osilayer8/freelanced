import express from 'express';
import mongoose from 'mongoose';

import Customer from '../models/customers';
import User from '../models/users';
import HttpError from '../models/http-error';

export const router = express.Router();

// get customer
router.get("/:cid", async (req, res, next) => {
  const reqId = await req.params.cid;
  let customer;
  try {
    customer = await Customer.findById(reqId);
  } catch (err) {
    const error = new HttpError("Looking for customer failed", 500);
    return next(error);
  }

  if (!customer) {
    const error = new HttpError("Could not find an customer", 404);
    return next(error);
  }

  res.json({ customer: customer.toObject({ getters: true }) });
});

// get customers by user id
router.get("/user/:uid", async (req, res, next) => {
  const userId = req.params.uid;

  let customers;
  try {
    customers = await Customer.find({ creator: userId });
  } catch (err) {
    const error = new HttpError("Could not find user", 500);
    return next(error);
  }

  if (!customers || customers.length === 0) {
    return next(
      new HttpError("Could not find customers for the provided used id", 404)
    );
  }

  res.json({
    customers: customers.map(customer => customer.toObject({ getters: true }))
  });
});

// update customer
router.patch("/:cid", async (req, res, next) => {
  const { name, age, description } = req.body;
  const userId = req.params.cid;

  let customer : any;
  try {
    customer = await Customer.findById(userId);
  } catch (err) {
    const error = new HttpError("Could not update customer", 500);
    return next(error);
  }

  customer.name = name;
  customer.age = age;
  customer.description = description;

  try {
    await customer.save();
  } catch (err) {
    const error = new HttpError("Customer updade failed", 500);
    return next(error);
  }

  res.status(200).json({ customer: customer.toObject({ getters: true }) });
});

// delete user
router.delete("/:cid", async (req, res, next) => {
  const customerId = req.params.cid;

  let customer : any;
  try {
    customer = await customer.findById(customerId);
  } catch (err) {
    const error = new HttpError("Could not delete customer", 500);
    return next(error);
  }

  try {
    await customer.remove();
  } catch (err) {
    const error = new HttpError("Delete customer failed", 500);
    return next(error);
  }

  res.status(200).json({ message: "Deleted customer." });
});

// get all customers
router.get("/", async (req, res, next) => {
  let customers;
  try {
    customers = await Customer.find().exec();
  } catch (err) {
    const error = new HttpError("Fetching customers failed", 500);
    return next(error);
  }
  res.json({
    customers: customers.map(customer => customer.toObject({ getters: true }))
  });
});

// add new customer
router.post("/", async (req, res, next) => {
  const {
    company,
    email,
    street,
    plz,
    city,
    country,
    phone,
    website,
    creator
  } = req.body;

  const createdCustomer = new Customer({
    company,
    email,
    street,
    plz,
    city,
    country,
    phone,
    website,
    creator
  });

  let user : any;

  try {
    user = await User.findById(creator);
    console.log(user);
  } catch (err) {
    const error = new HttpError("Could not find user for the provided id", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError(
      "Could not find user for the provided id",
      404
    );
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdCustomer.save({ session: sess });
    user.customers.push(createdCustomer);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("creating customer failed", 500);
    return next(error);
  }

  res
    .status(201)
    .json({ customer: createdCustomer.toObject({ getters: true }) });
});