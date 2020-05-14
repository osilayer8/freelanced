import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  created: { type: Date, required: false },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: String, required: false },
  tasks: [{
    title: { type: String, required: false },
    hours: { type: Number, required: false },
  }],
  owner: { type: mongoose.Types.ObjectId, required: true, ref: 'Customer' }
});

export = mongoose.model('Project', projectSchema);