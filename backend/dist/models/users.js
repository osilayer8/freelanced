"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const userSchema = new mongoose_1.default.Schema({
    created: { type: Date, required: false },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    pass: { type: String, required: true },
    language: { type: String, required: true },
    currency: { type: String, required: false },
    vat: { type: Number, required: true },
    customers: [{ type: mongoose_1.default.Types.ObjectId, required: true, ref: 'Customer' }]
});
userSchema.plugin(mongoose_unique_validator_1.default);
module.exports = mongoose_1.default.model('User', userSchema);
