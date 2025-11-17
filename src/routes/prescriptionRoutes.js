import express from "express";
import multer from "multer";
import path from "path";
import { protect, verifyPharmacist , adminOnly, adminOrPharmacist } from "../middleware/auth.js";
import {
  uploadPrescription,
  getUserPrescriptions,
  getAllPrescriptions,
  updatePrescriptionStatus
} from "../controllers/prescriptionController.js";

const router = express.Router();

// Multer config for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/prescriptions/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

// 🧾 Routes
router.post("/upload", protect, upload.single("file"), uploadPrescription);
router.get("/my", protect, getUserPrescriptions);
router.get("/all",protect, adminOrPharmacist, getAllPrescriptions);
// router.get("/admin", protect, adminOnly, getAllPrescriptions);
router.put("/status/:id", protect, verifyPharmacist, updatePrescriptionStatus);

export default router;
