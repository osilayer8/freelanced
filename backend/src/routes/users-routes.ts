import express from 'express';
import bcrypt from 'bcryptjs';
import cryptr from 'cryptr';
import jsonwebtoken from 'jsonwebtoken';

import User from '../models/users';
import HttpError from '../models/http-error';
import checkAuth from '../middleware/check-auth';

export const router = express.Router();
const crypter = new cryptr(`${process.env.CYP_KEY}`);

// identify user
router.post('/login', async (req, res, next) => {
  const { pass, email } = req.body;

  let identifiedUser: any;
  try {
    identifiedUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError('Login failed', 500);
    return next(error);
  }

  if (!identifiedUser) {
    const error = new HttpError('Could not identity user', 401);
    return next(error);
  }

  let isValidPassword: boolean = false;
  try {
    isValidPassword = await bcrypt.compare(pass, identifiedUser.pass);
  } catch (err) {
    const error = new HttpError('Credentials wrong, try again', 500);
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError('Invalid credentials', 401);
    return next(error);
  }

  let token: string;
  try {
    token = jsonwebtoken.sign(
      { user: identifiedUser.id, email: identifiedUser.email },
      process.env.JWL_KEY as string,
      { expiresIn: '4h' }
    );
  } catch (err) {
    const error = new HttpError('Login failed', 500);
    return next(error);
  }

  res.json({
    userId: identifiedUser.id,
    email: identifiedUser.email,
    theme: identifiedUser.theme,
    token: token,
  });
});

// register new user UPDATE: temporary invite
router.post('/signup', async (req, res, next) => {
  const { name, email, /*pass,*/ language, currency } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError('Invite failed', 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError('User exists already', 422);
    return next(error);
  }

  // let hashedPassword: string;
  // try {
  //   hashedPassword = await bcrypt.hash(pass, 12);
  // } catch (err) {
  //   const error = new HttpError("Could not create user", 500);
  //   return next(error);
  // }

  const createdUser: any = new User({
    created: new Date(),
    name,
    email,
    //pass: hashedPassword,
    language,
    theme: 'light',
    currency,
    vat: 0,
    customers: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError('Invite failed', 500);
    return next(error);
  }

  let token: string;
  try {
    token = jsonwebtoken.sign(
      { user: createdUser.id, email: createdUser.email },
      process.env.JWL_KEY as string,
      { expiresIn: '4h' }
    );
  } catch (err) {
    const error = new HttpError('Invite failed', 500);
    return next(error);
  }

  res.status(201).json({
    userId: createdUser.id,
    email: createdUser.email,
    token: token,
    theme: createdUser.theme,
  });
});

router.use(checkAuth);

// get user
router.get('/:uid', async (req: any, res: any, next: any) => {
  const reqId = await req.params.uid;
  let user;
  try {
    user = await User.findById(reqId, '-pass');
  } catch (err) {
    const error = new HttpError('Looking for user failed', 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find an user', 404);
    return next(error);
  }

  const userObj = user.toObject({ getters: true });
  let securedUser;
  if (userObj.iban) {
    const decryptIban = crypter.decrypt(userObj.iban);
    //const ibanCountry = decryptIban.substr(0, 2);
    //const ibanFun = parseInt('1' + decryptIban.substr(2)) / 1337;
    securedUser = { ...userObj, iban: decryptIban };
  }

  if (user.id !== req.userData.userId) {
    const error = new HttpError('Not allowed to see this user', 401);
    return next(error);
  }

  res.json({ user: securedUser ? securedUser : userObj });
});

// get all users
router.get('/', async (req: any, res: any, next: any) => {
  let users;
  try {
    users = await User.find({}, '-pass');
  } catch (err) {
    const error = new HttpError('Fetching users failed', 500);
    return next(error);
  }

  // no one allowed to see all customers
  if (req.userData.userId !== '0123456789') {
    const error = new HttpError('Not allowed to see this users', 401);
    return next(error);
  }

  res.json({
    users: users.map(
      (user: { toObject: (arg0: { getters: boolean }) => any }) =>
        user.toObject({ getters: true })
    ),
  });
});

// update user
router.patch('/:uid', async (req: any, res: any, next: any) => {
  const {
    company,
    firstName,
    name,
    street,
    zip,
    city,
    country,
    phone,
    businessMail,
    web,
    iban,
    bic,
    bank,
    taxId,
    commercialRegister,
    language,
    theme,
    currency,
    vat,
  } = req.body;
  const userId = req.params.uid;

  let user: any;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError('Could not update user', 500);
    return next(error);
  }

  if (user.id !== req.userData.userId) {
    const error = new HttpError('Not allowed to edit this user', 401);
    return next(error);
  }

  let encryptIban;
  iban !== '' && (encryptIban = crypter.encrypt(iban));

  user.company = company;
  user.firstName = firstName;
  user.name = name;
  user.street = street;
  user.zip = zip;
  user.city = city;
  user.country = country;
  user.phone = phone;
  user.businessMail = businessMail;
  user.web = web;
  iban !== '' && (user.iban = encryptIban);
  user.bic = bic;
  user.bank = bank;
  user.taxId = taxId;
  user.commercialRegister = commercialRegister;
  user.language = language;
  user.theme = theme;
  user.currency = currency;
  user.vat = vat;

  try {
    await user.save();
  } catch (err) {
    const error = new HttpError('User update failed', 500);
    return next(error);
  }

  res.status(200).json({ user: user.toObject({ getters: true }) });
});

// update password
router.patch('/password/:uid', async (req: any, res: any, next: any) => {
  const { pass } = req.body;
  const userId = req.params.uid;

  let user: any;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError('Could not update password', 500);
    return next(error);
  }

  if (user.id !== req.userData.userId) {
    const error = new HttpError('Not allowed to change password', 401);
    return next(error);
  }

  let hashedPassword: string;
  try {
    hashedPassword = await bcrypt.hash(pass, 12);
  } catch (err) {
    const error = new HttpError('Could not save password', 500);
    return next(error);
  }

  user.pass = hashedPassword;

  try {
    await user.save();
  } catch (err) {
    const error = new HttpError('Update password failed', 500);
    return next(error);
  }

  res.status(200).json({ user: user.toObject({ getters: true }) });
});

// delete user
router.delete('/:uid', async (req: any, res: any, next: any) => {
  const userId = req.params.uid;

  let user: any;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError('Could not delete user', 500);
    return next(error);
  }

  if (user.id !== req.userData.userId) {
    const error = new HttpError('Not allowed to delete this user', 401);
    return next(error);
  }

  try {
    await user.remove();
  } catch (err) {
    const error = new HttpError('Delete user failed', 500);
    return next(error);
  }

  res.status(200).json({ message: 'Deleted user.' });
});
