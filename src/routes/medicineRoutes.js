import express from 'express';
import upload from '../middleware/upload.js';
import { 
    addMedicine,
    getMedicines,
    updateMedicine, 
    deleteMedicine ,
    getMedicineById
} from '../controllers/medicineController.js';
import { protect, adminOnly , adminOrPharmacist } from '../middleware/auth.js';

const router = express.Router();

// Only logged-in admin can add medicine
router.post('/add', protect, adminOrPharmacist,upload.single("image"), addMedicine);
router.put("/:id", protect, adminOrPharmacist,upload.single("image"), updateMedicine);
router.delete("/:id", protect, adminOrPharmacist, deleteMedicine);
router.get("/", getMedicines);
router.get("/:id", getMedicineById); 

export default router;
