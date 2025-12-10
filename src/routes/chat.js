import express from "express";
import Medicine from "../models/Medicine.js";
import Billing from "../models/Billing.js";

// Local NLP Engine
import {
  detectGreeting,
  detectHelp,
  detectOrderId,
  detectOrderStatus,
  detectProductName,
  detectCategory,
  fuzzyMatchProduct
} from "../utils/nlpEngine.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const msg = req.body.message.toLowerCase();

  // 1. Greeting
  if (detectGreeting(msg)) {
    return res.json({ reply: "Hello! How can I assist you today?" });
  }

  // 2. Help
  if (detectHelp(msg)) {
    return res.json({
      reply:
        "I can help you search for medicines 👇\n• 'Find Panadol'\n• 'Show malaria medication'\n• 'Track order 88422'"
    });
  }

  // 3. Order ID search
  const orderId = detectOrderId(msg);
  if (orderId) {
    const order = await Billing.findById(orderId);
    if (!order)
      return res.json({ reply: "I couldn't find that order ID." });

    return res.json({ reply: `Order ${orderId} status: ${order.status}` });
  }

  // 4. Order status listing
  const status = detectOrderStatus(msg);
  if (status) {
    const orders = await Billing.find({ status });
    if (!orders.length)
      return res.json({ reply: `No orders with status "${status}".` });

    return res.json({
      reply:
        `Orders marked "${status}":\n` +
        orders.map(o => `• Order ${o._id}`).join("\n")
    });
  }

  // 5. Search by category
  const category = detectCategory(msg);
  if (category) {
    const meds = await Medicine.find({
      category: { $regex: category, $options: "i" }
    });

    if (!meds.length)
      return res.json({
        reply: `No medicines found under category "${category}".`
      });

    return res.json({
      reply:
        `Here are ${category} medicines:\n` +
        meds
          .map(m => `• <a href="/product/${m._id}" class="text-blue-600 underline">${m.name}</a>`)
          .join("<br>")
    });
  }

  // 6. Search by product name
  const productName = detectProductName(msg);
  if (productName) {
    const meds = await Medicine.find();
    const match = fuzzyMatchProduct(productName, meds);

    if (match) {
      return res.json({
        reply: `Found: <a href="/product/${match._id}" class="text-blue-600 underline">${match.name}</a>`
      });
    }

    return res.json({
      reply: `I couldn't find a medicine similar to "${productName}".`
    });
  }

  // 7. Default fallback
  res.json({
    reply:
      "I'm not sure I understood. Try:\n• 'Find Panadol'\n• 'Track order 8842'\n• 'Show malaria drugs'\n• 'Help'"
  });
});

export default router;
