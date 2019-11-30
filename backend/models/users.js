const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: false },
  description: { type: String, required: false }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
