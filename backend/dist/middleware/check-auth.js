"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_error_1 = __importDefault(require("../models/http-error"));
exports.default = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            throw new Error('Authentication failed 1');
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWL_KEY);
        req.userData = { userId: decodedToken.user };
        next();
    }
    catch (err) {
        const error = new http_error_1.default('Authentication failed 2', 401);
        return next(error);
    }
};
