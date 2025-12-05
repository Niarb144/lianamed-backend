import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: {
    type: String,
    enum: ["prescription", "billing", "chat", "system"],
    default: "system"
  },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Notification", notificationSchema);
