import Billing from '../models/Billing.js';
import Medicine from '../models/Medicine.js';
import User from '../models/User.js';
import Notification from "../models/Notification.js";

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
      status: "Pending",
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

// PUT /api/orders/:id/status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedOrder = await Billing.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate("customer", "name email")
      .populate("medicines.med", "name price");

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 🔔 Create Notification
        // const message =
        //   status === "Delivered"
        //     ? "Your order of has been delivered."
        //     : "Your prescription has been rejected.";
    
        // await Notification.create({
        //   user: updatedOrder.user,
        //   message,
        // });

    res.json({
      message: `✅ Order marked as ${status}`,
      order: updatedOrder,
    });
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({ message: "Failed to update order status" });
  }
};


