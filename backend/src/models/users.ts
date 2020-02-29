import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: false },
  description: { type: String, required: false }
});

userSchema.plugin(uniqueValidator);

export = mongoose.model("User", userSchema);
