"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
const projectSchema = new mongoose_1.default.Schema({
    created: { type: Date, required: false },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: String, required: false },
    tasks: [{
            title: { type: String, required: false },
            hours: { type: Number, required: false },
        }],
    invoiceNo: { type: String, required: false },
    additionalPdfText: { type: String, required: false },
    owner: { type: mongoose_1.default.Types.ObjectId, required: true, ref: 'Customer' }
});
module.exports = mongoose_1.default.model('Project', projectSchema);
