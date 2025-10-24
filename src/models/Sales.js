import mongoose from 'mongoose';

const salesSchema = new mongoose.Schema({
  pharmacist: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  med: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' },
  count: Number,
  totalAmount: Number,
  date: { type: Date, default: Date.now }
});

export default mongoose.model('Sales', salesSchema);
