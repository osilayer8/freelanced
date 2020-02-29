import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import { router as usersRoutes } from './routes/users-routes';
import { router as customersRoutes } from './routes/customers-routes';
import HttpError from './models/http-error';

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/api/users", usersRoutes);

app.use("/api/customers", customersRoutes);

// give back custom error msg if route doesn't exist
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  throw error;
});

// default error when server is not responding
app.use((error : any, req : any, res : any, next : any) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose
  .connect(
    "mongodb+srv://osilayer8:********@cluster0-f6ait.mongodb.net/freelanced?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to database!");
    app.listen(5000);
  })
  .catch(err => {
    console.log(err);
  });