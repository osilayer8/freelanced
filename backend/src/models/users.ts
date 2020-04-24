import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  pass: { type: String, required: true },
  language: { type: String, required: true },
  customers: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Customer' }]
});

userSchema.plugin(uniqueValidator);

export = mongoose.model('User', userSchema);
