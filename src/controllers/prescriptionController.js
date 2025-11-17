import Prescription from "../models/Prescription.js";
import Notification from "../models/Notification.js";

// 📤 Upload prescription
export const uploadPrescription = async (req, res) => {
  try {
    const { notes } = req.body;
    const filePath = `/uploads/prescriptions/${req.file.filename}`;

    const newPrescription = await Prescription.create({
      user: req.user.id,
      file: filePath,
      notes,
    });

    res.status(201).json({ message: "Prescription uploaded", prescription: newPrescription });
  } catch (error) {
    console.error("Error uploading prescription:", error);
    res.status(500).json({ message: "Failed to upload prescription" });
  }
};

// 👤 Get prescriptions for logged-in user
export const getUserPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch prescriptions" });
  }
};

// 👨‍⚕️ Pharmacist view all prescriptions
export const getAllPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch all prescriptions" });
  }
};

// 🔄 Update prescription status
export const updatePrescriptionStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const prescription = await Prescription.findById(req.params.id).populate("user");

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    prescription.status = status;
    await prescription.save();

    // 🔔 Create Notification
    const message =
      status === "approved"
        ? "Your prescription of has been approved."
        : "Your prescription has been rejected.";

    await Notification.create({
      user: prescription.user._id,
      message,
    });

    res.json({ success: true, prescription });
  } catch (err) {
    console.error("Update prescription error:", err);
    res.status(500).json({ message: "Failed to update prescription status" });
  }
};
