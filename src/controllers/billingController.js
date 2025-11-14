import Billing from '../models/Billing.js';
import Medicine from '../models/Medicine.js';
import User from '../models/User.js';

export const createOrder = async (req, res) => {
  try {
    const { userId, items } = req.body;

    if (!userId || !items || !items.length) {
      return res.status(400).json({ message: "Missing order details" });
    }

    // Validate user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Validate medicines and compute total
    let totalAmount = 0;
    const medicineList = [];

    for (const i of items) {
      const med = await Medicine.findById(i._id);
      if (!med) continue;
      totalAmount += med.price * i.quantity;
      medicineList.push({
        med: med._id,
        qty: i.quantity,
        price: med.price,
      });
    }

    const billing = new Billing({
      customer: user._id,
      medicines: medicineList,
      totalAmount,
    });

    await billing.save();

    res.status(201).json({
      message: "✅ Order created successfully!",
      billing,
    });
  } catch (err) {
    console.error("❌ Error creating order:", err);
    res.status(500).json({ message: "Failed to create order", error: err.message });
  }
};

// ✅ Fetch all orders (pharmacist only)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Billing.find()
      .populate('customer', 'name email')
      .populate('medicines.med', 'name price')
      .sort({ date: -1 });
    res.json(orders);
  } catch (err) {
    console.error('Error fetching all orders:', err);
    res.status(500).json({ message: 'Failed to fetch all orders.' });
  }
};

// ✅ Fetch orders for logged-in user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id; // from JWT middleware
    const orders = await Billing.find({ customer: userId })
      .populate('medicines.med', 'name price')
      .sort({ date: -1 });
    res.json(orders);
  } catch (err) {
    console.error('Error fetching user orders:', err);
    res.status(500).json({ message: 'Failed to fetch your orders.' });
  }
};

