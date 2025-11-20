import Billing from '../models/Billing.js';
import Medicine from '../models/Medicine.js';
import User from '../models/User.js';
import Notification from "../models/Notification.js";

export const createOrder = async (req, res) => {
  try {
    const { userId, items, deliveryAddress, billingAddress, paymentMethod } = req.body;

    if (!userId || !items || !deliveryAddress || !billingAddress || !paymentMethod) {
      return res.status(400).json({ message: "Missing order details" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    let totalAmount = 0;
    const medicineList = [];

    for (const i of items) {
      const med = await Medicine.findById(i._id);
      if (!med) continue;

      totalAmount += med.price * i.quantity;
      medicineList.push({ med: med._id, qty: i.quantity, price: med.price });
    }

    const billing = new Billing({
      customer: user._id,
      medicines: medicineList,
      totalAmount,
      deliveryAddress,
      billingAddress,
      paymentMethod,
      paymentStatus: "Pending",
      status: "Pending",
    });

    await billing.save();

    res.status(201).json({
      message: "Order created, proceed to payment",
      billingId: billing._id,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create order" });
  }
};

// ✅ Simulate payment processing
export const payOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { success } = req.body; // frontend tells payment result

    const order = await Billing.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.paymentStatus = success ? "Paid" : "Failed";
    await order.save();

    res.json({ message: "Payment updated", order });

  } catch (err) {
    res.status(500).json({ message: "Payment error" });
  }
};



// ✅ Fetch all orders (pharmacist and admin only)
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

// GET /billing/:id
export const getOrderById = async (req, res) => {
  try {
    const order = await Billing.findById(req.params.id)
      .populate("customer", "name email")
      .populate("medicines.med", "name price");

    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch order" });
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

    res.json({
      message: `✅ Order marked as ${status}`,
      order: updatedOrder,
    });
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({ message: "Failed to update order status" });
  }
};


