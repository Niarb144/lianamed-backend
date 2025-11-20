import mongoose from "mongoose";

const billingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    medicines: [
      {
        med: { type: mongoose.Schema.Types.ObjectId, ref: "Medicine", required: true },
        qty: Number,
        price: Number,
      },
    ],

    totalAmount: Number,

    deliveryAddress: { type: String, required: true },
    billingAddress: { type: String, required: true },

    paymentMethod: {
      type: String,
      enum: ["Mpesa", "Card", "PayPal"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },

    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },

    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Billing", billingSchema);