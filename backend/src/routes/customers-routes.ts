import express from 'express';
import mongoose from 'mongoose';

import Customer from '../models/customers';
import User from '../models/users';
import HttpError from '../models/http-error';
import checkAuth from '../middleware/check-auth';

export const router = express.Router();

router.use(checkAuth);

// get customer
router.get('/:cid', async (req: any, res: any, next: any) => {
  const reqId = await req.params.cid;
  let customer: any;
  try {
    customer = await Customer.findById(reqId);
  } catch (err) {
    const error = new HttpError('Looking for customer failed!', 500);
    return next(error);
  }

  if (!customer) {
    const error = new HttpError('Could not find an customer', 404);
    return next(error);
  }

  if (customer.toObject().creator.toString() !== req.userData.userId) {
    const error = new HttpError('Not allowed to see this place', 401);
    return next(error);
  }

  res.json({ customer: customer.toObject({ getters: true }) });
});

// get customers by user id
router.get('/user/:uid', async (req: any, res: any, next: any) => {
  const userId = req.params.uid;

  let userWithCustomers: any;
  try {
    userWithCustomers = await User.findById(userId).populate('customers');
  } catch (err) {
    const error = new HttpError('Fetching customers failed', 500);
    return next(error);
  }

  if (!userWithCustomers || userWithCustomers.customers.length === 0) {
    return next(
      new HttpError('Could not find customers for the provided used id', 404)
    );
  }

  if (
    userWithCustomers.customers[0].toObject().creator.toString() !==
    req.userData.userId
  ) {
    const error = new HttpError('Not allowed to see this places', 401);
    return next(error);
  }

  res.json({
    customers: userWithCustomers.customers.map((customer: any) =>
      customer.toObject({ getters: true })
    ),
  });
});

// update customer
router.patch('/:cid', async (req: any, res: any, next: any) => {
  const { company, email, street, plz, city, country, phone, website } =
    req.body;

  const customerId = req.params.cid;

  let customer: any;
  try {
    customer = await Customer.findById(customerId);
  } catch (err) {
    const error = new HttpError('Could not update customer', 500);
    return next(error);
  }

  if (customer.creator.toString() !== req.userData.userId) {
    const error = new HttpError('Not allowed to edit this place', 401);
    return next(error);
  }

  customer.company = company;
  customer.email = email;
  customer.street = street;
  customer.plz = plz;
  customer.city = city;
  customer.country = country;
  customer.phone = phone;
  customer.website = website;

  try {
    await customer.save();
  } catch (err) {
    const error = new HttpError('Customer updade failed', 500);
    return next(error);
  }

  res.status(200).json({ customer: customer.toObject({ getters: true }) });
});

// delete customer
router.delete('/:cid', async (req: any, res: any, next: any) => {
  const customerId = req.params.cid;

  let customer: any;
  try {
    customer = await Customer.findById(customerId).populate('creator');
  } catch (err) {
    const error = new HttpError('Could not delete customer', 500);
    return next(error);
  }

  if (!customer) {
    const error = new HttpError('Could not find customer for this id', 404);
    return next(error);
  }

  if (customer.creator.id !== req.userData.userId) {
    const error = new HttpError('Not allowed to delete this place', 401);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await customer.remove({ session: sess });
    customer.creator.customers.pull(customer);
    await customer.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError('Delete customer failed', 500);
    return next(error);
  }

  res.status(200).json({ message: 'Deleted customer.' });
});

// get all customers
router.get('/', async (req: any, res: any, next: any) => {
  let customers;
  try {
    customers = await Customer.find().exec();
  } catch (err) {
    const error = new HttpError('Fetching customers failed', 500);
    return next(error);
  }

  // no one allowed to see all customers
  if (req.userData.userId !== '0123456789') {
    const error = new HttpError('Not allowed to see this places', 401);
    return next(error);
  }

  res.json({
    customers: customers.map((customer) =>
      customer.toObject({ getters: true })
    ),
  });
});

// add new customer
router.post('/', async (req: any, res: any, next: any) => {
  const { company, email, street, plz, city, country, phone, website } =
    req.body;

  const createdCustomer: any = new Customer({
    created: new Date(),
    company,
    email,
    street,
    plz,
    city,
    country,
    phone,
    website,
    projects: [],
    creator: req.userData.userId,
  });

  let user: any;

  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError('Create customer failed', 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find user for the provided id', 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdCustomer.save({ session: sess });
    user.customers.push(createdCustomer);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      'creating customer failed while user connection',
      500
    );
    return next(error);
  }

  res
    .status(201)
    .json({ customer: createdCustomer.toObject({ getters: true }) });
});
