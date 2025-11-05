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
