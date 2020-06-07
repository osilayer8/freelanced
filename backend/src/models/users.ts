import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const userSchema = new mongoose.Schema({
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
  pass: { type: String, required: true },
  language: { type: String, required: true },
  currency: { type: String, required: false },
  vat: { type: Number, required: true },
  customers: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Customer' }]
});

userSchema.plugin(uniqueValidator);

export = mongoose.model('User', userSchema);
