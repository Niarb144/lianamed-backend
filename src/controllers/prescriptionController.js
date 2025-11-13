import Prescription from "../models/Prescription.js";

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
