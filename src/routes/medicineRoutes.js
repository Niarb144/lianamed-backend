import express from 'express';
import upload from '../middleware/upload.js';
import { 
    addMedicine,
    getMedicines,
    updateMedicine, 
    deleteMedicine 
} from '../controllers/medicineController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Only logged-in admin can add medicine
router.post('/add', protect, adminOnly,upload.single("image"), addMedicine);
router.put("/:id", protect, adminOnly,upload.single("image"), updateMedicine);
router.delete("/:id", protect, adminOnly, deleteMedicine);
router.get("/", protect, getMedicines);

export default router;
