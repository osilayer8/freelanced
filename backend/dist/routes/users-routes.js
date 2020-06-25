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
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const cryptr_1 = __importDefault(require("cryptr"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const users_1 = __importDefault(require("../models/users"));
const http_error_1 = __importDefault(require("../models/http-error"));
const check_auth_1 = __importDefault(require("../middleware/check-auth"));
exports.router = express_1.default.Router();
const crypter = new cryptr_1.default(`${process.env.CYP_KEY}`);
// identify user
exports.router.post("/login", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { pass, email } = req.body;
    let identifiedUser;
    try {
        identifiedUser = yield users_1.default.findOne({ email: email });
    }
    catch (err) {
        const error = new http_error_1.default("Login failed", 500);
        return next(error);
    }
    if (!identifiedUser) {
        const error = new http_error_1.default("Could not identity user", 401);
        return next(error);
    }
    let isValidPassword = false;
    try {
        isValidPassword = yield bcryptjs_1.default.compare(pass, identifiedUser.pass);
    }
    catch (err) {
        const error = new http_error_1.default("Credentials wrong, try again", 500);
        return next(error);
    }
    if (!isValidPassword) {
        const error = new http_error_1.default("Invalid credentials", 401);
        return next(error);
    }
    let token;
    try {
        token = jsonwebtoken_1.default.sign({ user: identifiedUser.id, email: identifiedUser.email }, process.env.JWL_KEY, { expiresIn: '2h' });
    }
    catch (err) {
        const error = new http_error_1.default("Login failed", 500);
        return next(error);
    }
    res.json({ userId: identifiedUser.id, email: identifiedUser.email, token: token });
}));
// register new user
exports.router.post("/signup", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, pass, language, currency } = req.body;
    const error = new http_error_1.default("Not allowed to create user", 401);
    return next(error);
    let existingUser;
    try {
        existingUser = yield users_1.default.findOne({ email: email });
    }
    catch (err) {
        const error = new http_error_1.default("Signing up failed", 500);
        return next(error);
    }
    if (existingUser) {
        const error = new http_error_1.default("User exists already", 422);
        return next(error);
    }
    let hashedPassword;
    try {
        hashedPassword = yield bcryptjs_1.default.hash(pass, 12);
    }
    catch (err) {
        const error = new http_error_1.default("Could not create user", 500);
        return next(error);
    }
    const createdUser = new users_1.default({
        created: new Date(),
        name,
        email,
        pass: hashedPassword,
        language,
        currency,
        vat: 0,
        customers: []
    });
    try {
        yield createdUser.save();
    }
    catch (err) {
        const error = new http_error_1.default("Signing up failed", 500);
        return next(error);
    }
    let token;
    try {
        token = jsonwebtoken_1.default.sign({ user: createdUser.id, email: createdUser.email }, process.env.JWL_KEY, { expiresIn: '4h' });
    }
    catch (err) {
        const error = new http_error_1.default("Signing up failed", 500);
        return next(error);
    }
    res.status(201).json({ userId: createdUser.id, email: createdUser.email, token: token });
}));
exports.router.use(check_auth_1.default);
// get user
exports.router.get("/:uid", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const reqId = yield req.params.uid;
    let user;
    try {
        user = yield users_1.default.findById(reqId, '-pass');
    }
    catch (err) {
        const error = new http_error_1.default("Looking for user failed", 500);
        return next(error);
    }
    if (!user) {
        const error = new http_error_1.default("Could not find an user", 404);
        return next(error);
    }
    const userObj = user.toObject({ getters: true });
    let securedUser;
    if (userObj.iban) {
        const decryptIban = crypter.decrypt(userObj.iban);
        const ibanCountry = decryptIban.substr(0, 2);
        const ibanFun = parseInt('1' + decryptIban.substr(2)) / 1337;
        securedUser = Object.assign(Object.assign({}, userObj), { iban: ibanCountry + ibanFun });
    }
    if (user.id !== req.userData.userId) {
        const error = new http_error_1.default("Not allowed to see this user", 401);
        return next(error);
    }
    res.json({ user: securedUser ? securedUser : userObj });
}));
// get all users
exports.router.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let users;
    try {
        users = yield users_1.default.find({}, '-pass');
    }
    catch (err) {
        const error = new http_error_1.default("Fetching users failed", 500);
        return next(error);
    }
    // no one allowed to see all customers
    if (req.userData.userId !== '0123456789') {
        const error = new http_error_1.default("Not allowed to see this users", 401);
        return next(error);
    }
    res.json({ users: users.map((user) => user.toObject({ getters: true })) });
}));
// update user
exports.router.patch("/:uid", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { company, firstName, name, street, zip, city, country, phone, businessMail, web, iban, bic, bank, taxId, commercialRegister, language, currency, vat } = req.body;
    const userId = req.params.uid;
    let user;
    try {
        user = yield users_1.default.findById(userId);
    }
    catch (err) {
        const error = new http_error_1.default("Could not update user", 500);
        return next(error);
    }
    if (user.id !== req.userData.userId) {
        const error = new http_error_1.default("Not allowed to edit this user", 401);
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
    user.currency = currency;
    user.vat = vat;
    try {
        yield user.save();
    }
    catch (err) {
        const error = new http_error_1.default("User update failed", 500);
        return next(error);
    }
    res.status(200).json({ user: user.toObject({ getters: true }) });
}));
// update password
exports.router.patch("/password/:uid", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { pass } = req.body;
    const userId = req.params.uid;
    let user;
    try {
        user = yield users_1.default.findById(userId);
    }
    catch (err) {
        const error = new http_error_1.default("Could not update password", 500);
        return next(error);
    }
    if (user.id !== req.userData.userId) {
        const error = new http_error_1.default("Not allowed to change password", 401);
        return next(error);
    }
    let hashedPassword;
    try {
        hashedPassword = yield bcryptjs_1.default.hash(pass, 12);
    }
    catch (err) {
        const error = new http_error_1.default("Could not save password", 500);
        return next(error);
    }
    user.pass = hashedPassword;
    try {
        yield user.save();
    }
    catch (err) {
        const error = new http_error_1.default("Update password failed", 500);
        return next(error);
    }
    res.status(200).json({ user: user.toObject({ getters: true }) });
}));
// delete user
exports.router.delete("/:uid", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.uid;
    let user;
    try {
        user = yield users_1.default.findById(userId);
    }
    catch (err) {
        const error = new http_error_1.default("Could not delete user", 500);
        return next(error);
    }
    if (user.id !== req.userData.userId) {
        const error = new http_error_1.default("Not allowed to delete this user", 401);
        return next(error);
    }
    try {
        yield user.remove();
    }
    catch (err) {
        const error = new http_error_1.default("Delete user failed", 500);
        return next(error);
    }
    res.status(200).json({ message: "Deleted user." });
}));
