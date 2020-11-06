"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const userSchema = new mongoose_1.default.Schema({
    created: { type: Date, required: false },
    company: { type: String, required: false },
    firstName: { type: String, required: false },
    name: { type: String, required: true },
    street: { type: String, required: false },
    zip: { type: Number, required: false },
    city: { type: String, required: false },
    country: { type: String, required: false },
    phone: { type: String, required: false },
    businessMail: { type: String, required: false },
    web: { type: String, required: false },
    iban: { type: String, required: false },
    bic: { type: String, required: false },
    bank: { type: String, required: false },
    taxId: { type: String, required: false },
    commercialRegister: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    pass: { type: String, required: false },
    language: { type: String, required: true },
    currency: { type: String, required: false },
    vat: { type: Number, required: true },
    theme: { type: String, required: true },
    active: { type: Boolean, required: false },
    customers: [
        { type: mongoose_1.default.Types.ObjectId, required: true, ref: 'Customer' },
    ],
});
userSchema.plugin(mongoose_unique_validator_1.default);
module.exports = mongoose_1.default.model('User', userSchema);
