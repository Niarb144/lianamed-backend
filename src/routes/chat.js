import express from "express";
import Medicine from "../models/Medicine.js";
import Billing from "../models/Billing.js";

const router = express.Router();

// Extract numeric order ID from any text
function extractOrderId(text) {
  const match = text.match(/\b\d{4,}\b/);
  return match ? match[0] : null;
}

// Detect common order statuses
const STATUS_KEYWORDS = {
  pending: ["pending", "not processed", "awaiting"],
  processing: ["processing", "in progress"],
  shipped: ["shipped", "on the way", "out for delivery"],
  delivered: ["delivered", "complete", "completed"],
  cancelled: ["cancelled", "canceled", "void"]
};

function detectOrderStatus(message) {
  for (const [status, keys] of Object.entries(STATUS_KEYWORDS)) {
    if (keys.some((k) => message.includes(k))) {
      return status;
    }
  }
  return null;
}

router.post("/", async (req, res) => {
  try {
    const message = req.body.message.toLowerCase();

    // -------------------------
    // 1. ORDER TRACKING BY ID
    // -------------------------
    if (message.includes("order") || message.includes("track")) {
      const orderId = extractOrderId(message);

      if (orderId) {
        const order = await Billing.findById(orderId);

        if (!order) {
          return res.json({ reply: "I couldn't find that order ID." });
        }

        return res.json({
          reply: `Your order (${orderId}) status is: **${order.status}**`
        });
      }

      // If user didn't provide ID but asked about order
      return res.json({
        reply: "Please provide your order ID, e.g. 'Track order 12345'."
      });
    }

    // ---------------------------------------------
    // 2. ORDER SEARCH BY STATUS (NEW FEATURE)
    // ---------------------------------------------
    const detectedStatus = detectOrderStatus(message);
    if (detectedStatus) {
      const orders = await Billing.find({ status: detectedStatus }).limit(10);

      if (orders.length === 0) {
        return res.json({
          reply: `No orders found with status "${detectedStatus}".`
        });
      }

      return res.json({
        reply:
          `Here are your ${detectedStatus} orders:\n` +
          orders.map((o) => `• Order ${o._id} – ${o.status}`).join("\n")
      });
    }

    // --------------------------------
    // 3. PRODUCT SEARCH BY NAME
    // --------------------------------
    const medicineByName = await Medicine.find({
      name: { $regex: message, $options: "i" }
    }).limit(5);

    if (medicineByName.length > 0) {
      return res.json({
        reply:
          "Here are some products I found:\n" +
          medicineByName.map((m) => `• ${m.name}`).join("\n")
      });
    }

    // --------------------------------
    // 4. PRODUCT SEARCH BY CATEGORY
    // --------------------------------
    const medicineByCategory = await Medicine.find({
      category: { $regex: message, $options: "i" }
    }).limit(5);

    if (medicineByCategory.length > 0) {
      return res.json({
        reply:
          "Here are products in that category:\n" +
          medicineByCategory.map((m) => `• ${m.name}`).join("\n")
      });
    }

    // ---------------------------
    // 5. DEFAULT FALLBACK
    // ---------------------------
    res.json({
      reply:
        "I can help with:\n" +
        "• Searching medicines by name or category\n" +
        "• Tracking an order\n" +
        "• Finding orders by status (delivered, pending, cancelled)\n\n" +
        "Try:\n" +
        "• 'Search paracetamol'\n" +
        "• 'Find antibiotics'\n" +
        "• 'Track order 1234'\n" +
        "• 'Show delivered orders'"
    });
  } catch (error) {
    console.log("Chatbot error:", error);
    res.json({ reply: "Something went wrong, please try again." });
  }
});

export default router;
