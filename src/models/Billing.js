import mongoose from 'mongoose';

const billingSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  medicines: [{ med: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' }, qty: Number, price: Number }],
  totalAmount: Number,
  date: { type: Date, default: Date.now }
});

export default mongoose.model('Billing', billingSchema);
