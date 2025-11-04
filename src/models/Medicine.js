import mongoose from 'mongoose';

const medSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: String,
  description: String,
  price: Number,
  stock: { type: Number, default: 0 },
  image: { type: String},
}, { timestamps: true });

export default mongoose.model('Medicine', medSchema);
