"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
const customerSchema = new mongoose_1.default.Schema({
    created: { type: Date, required: false },
    company: { type: String, required: true },
    email: { type: String, required: true },
    street: { type: String, required: false },
    plz: { type: String, required: false },
    city: { type: String, required: false },
    country: { type: String, required: false },
    phone: { type: String, required: false },
    website: { type: String, required: false },
    projects: [{ type: mongoose_1.default.Types.ObjectId, required: true, ref: 'Projects' }],
    creator: { type: mongoose_1.default.Types.ObjectId, required: true, ref: 'User' }
});
module.exports = mongoose_1.default.model('Customer', customerSchema);
