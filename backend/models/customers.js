const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  company: { type: String, required: true },
  email: { type: String, required: true },
  street: { type: String, required: false },
  plz: { type: String, required: false },
  city: { type: String, required: false },
  country: { type: String, required: false },
  phone: { type: String, required: false },
  website: { type: String, required: false },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' }
});

module.exports = mongoose.model("Customer", customerSchema);