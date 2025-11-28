import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin','pharmacist','patient','rider'], default: 'patient' },
  contact: String,
  age: Number,
  gender: String,
}, { timestamps: true });

export default mongoose.model('User', userSchema);
