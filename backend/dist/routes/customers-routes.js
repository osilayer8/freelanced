"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const customers_1 = __importDefault(require("../models/customers"));
const users_1 = __importDefault(require("../models/users"));
const http_error_1 = __importDefault(require("../models/http-error"));
const check_auth_1 = __importDefault(require("../middleware/check-auth"));
exports.router = express_1.default.Router();
exports.router.use(check_auth_1.default);
// get customer
exports.router.get("/:cid", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const reqId = yield req.params.cid;
    let customer;
    try {
        customer = yield customers_1.default.findById(reqId);
    }
    catch (err) {
        const error = new http_error_1.default("Looking for customer failed!", 500);
        return next(error);
    }
    if (!customer) {
        const error = new http_error_1.default("Could not find an customer", 404);
        return next(error);
    }
    if (customer.toObject().creator.toString() !== req.userData.userId) {
        const error = new http_error_1.default("Not allowed to see this place", 401);
        return next(error);
    }
    res.json({ customer: customer.toObject({ getters: true }) });
}));
// get customers by user id
exports.router.get("/user/:uid", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.uid;
    let userWithCustomers;
    try {
        userWithCustomers = yield users_1.default.findById(userId).populate('customers');
    }
    catch (err) {
        const error = new http_error_1.default("Fetching customers failed", 500);
        return next(error);
    }
    if (!userWithCustomers || userWithCustomers.customers.length === 0) {
        return next(new http_error_1.default("Could not find customers for the provided used id", 404));
    }
    if (userWithCustomers.customers[0].toObject().creator.toString() !== req.userData.userId) {
        const error = new http_error_1.default("Not allowed to see this places", 401);
        return next(error);
    }
    res.json({ customers: userWithCustomers.customers.map((customer) => customer.toObject({ getters: true })) });
}));
// update customer
exports.router.patch("/:cid", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { company, email, street, plz, city, country, phone, website } = req.body;
    const customerId = req.params.cid;
    let customer;
    try {
        customer = yield customers_1.default.findById(customerId);
    }
    catch (err) {
        const error = new http_error_1.default("Could not update customer", 500);
        return next(error);
    }
    if (customer.creator.toString() !== req.userData.userId) {
        const error = new http_error_1.default("Not allowed to edit this place", 401);
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
        yield customer.save();
    }
    catch (err) {
        const error = new http_error_1.default("Customer updade failed", 500);
        return next(error);
    }
    res.status(200).json({ customer: customer.toObject({ getters: true }) });
}));
// delete customer
exports.router.delete("/:cid", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const customerId = req.params.cid;
    let customer;
    try {
        customer = yield customers_1.default.findById(customerId).populate('creator');
    }
    catch (err) {
        const error = new http_error_1.default("Could not delete customer", 500);
        return next(error);
    }
    if (!customer) {
        const error = new http_error_1.default("Could not find customer for this id", 404);
        return next(error);
    }
    if (customer.creator.id !== req.userData.userId) {
        const error = new http_error_1.default("Not allowed to delete this place", 401);
        return next(error);
    }
    try {
        const sess = yield mongoose_1.default.startSession();
        sess.startTransaction();
        yield customer.remove({ session: sess });
        customer.creator.customers.pull(customer);
        yield customer.creator.save({ session: sess });
        yield sess.commitTransaction();
    }
    catch (err) {
        const error = new http_error_1.default("Delete customer failed", 500);
        return next(error);
    }
    res.status(200).json({ message: "Deleted customer." });
}));
// get all customers
exports.router.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let customers;
    try {
        customers = yield customers_1.default.find().exec();
    }
    catch (err) {
        const error = new http_error_1.default("Fetching customers failed", 500);
        return next(error);
    }
    // no one allowed to see all customers
    if (req.userData.userId !== '0123456789') {
        const error = new http_error_1.default("Not allowed to see this places", 401);
        return next(error);
    }
    res.json({
        customers: customers.map(customer => customer.toObject({ getters: true }))
    });
}));
// add new customer
exports.router.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { company, email, street, plz, city, country, phone, website } = req.body;
    const createdCustomer = new customers_1.default({
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
        creator: req.userData.userId
    });
    let user;
    try {
        user = yield users_1.default.findById(req.userData.userId);
    }
    catch (err) {
        const error = new http_error_1.default("Create customer failed", 500);
        return next(error);
    }
    if (!user) {
        const error = new http_error_1.default("Could not find user for the provided id", 404);
        return next(error);
    }
    try {
        const sess = yield mongoose_1.default.startSession();
        sess.startTransaction();
        yield createdCustomer.save({ session: sess });
        user.customers.push(createdCustomer);
        yield user.save({ session: sess });
        yield sess.commitTransaction();
    }
    catch (err) {
        const error = new http_error_1.default("creating customer failed while user connection", 500);
        return next(error);
    }
    res
        .status(201)
        .json({ customer: createdCustomer.toObject({ getters: true }) });
}));
