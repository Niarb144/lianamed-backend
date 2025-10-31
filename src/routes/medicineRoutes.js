import express from 'express';
import { 
    addMedicine,
    getMedicines,
    updateMedicine, 
    deleteMedicine 
} from '../controllers/medicineController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Only logged-in admin can add medicine
router.post('/add', protect, adminOnly, addMedicine);
router.put("/:id", protect, adminOnly, updateMedicine);
router.delete("/:id", protect, adminOnly, deleteMedicine);
router.get("/", protect, getMedicines);

export default router;
