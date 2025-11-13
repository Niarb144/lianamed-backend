import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    file: { type: String, required: true }, // file path or URL
    notes: { type: String },
    status: {
      type: String,
      enum: ["pending", "reviewed", "completed"],
      default: "pending",
    },
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Prescription", prescriptionSchema);
