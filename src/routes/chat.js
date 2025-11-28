import express from "express";
import Medicine from "../models/Medicine.js";
import Billing from "../models/Billing.js";

const router = express.Router();

// Extract order ID from text
function extractOrderId(text) {
  const match = text.match(/\b\d{4,}\b/);
  return match ? match[0] : null;
}

router.post("/", async (req, res) => {
  try {
    const message = req.body.message.toLowerCase();

    // 1. Order Tracking
    if (message.includes("order")) {
      const orderId = extractOrderId(message);
      if (!orderId) {
        return res.json({ reply: "Please provide your order ID." });
      }

      const order = await Billing.findById(orderId);
      if (!order) return res.json({ reply: "Order not found." });

      return res.json({
        reply: `Your order status is: ${order.status}.`
      });
    }

    // 2. Product Search
    const meds = await Medicine.find({
      name: { $regex: message, $options: "i" }
    }).limit(5);

    if (meds.length > 0) {
      return res.json({
        reply:
          "Here are some products I found:\n" +
          meds.map((m) => `• ${m.name}`).join("\n")
      });
    }

    // 3. Default response
    res.json({
      reply: "I can help you search medicines or track your order. Try: 'Search paracetamol' or 'Track order 1234'."
    });
  } catch (error) {
    res.json({ reply: "Something went wrong." });
  }
});

export default router;
