import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  created: { type: Date, required: false },
  company: { type: String, required: true },
  email: { type: String, required: true },
  street: { type: String, required: false },
  plz: { type: String, required: false },
  city: { type: String, required: false },
  country: { type: String, required: false },
  phone: { type: String, required: false },
  website: { type: String, required: false },
  projects: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Projects' }],
  creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' }
});

export = mongoose.model('Customer', customerSchema);