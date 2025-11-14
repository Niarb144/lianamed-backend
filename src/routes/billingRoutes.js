import express from 'express';
import { createOrder, getAllOrders, getUserOrders } from '../controllers/billingController.js';
import { protect, verifyPharmacist } from '../middleware/auth.js';

const router = express.Router();

router.post('/checkout', createOrder);

// 🧾 Pharmacist — view all
router.get('/all', protect, verifyPharmacist, getAllOrders);

// 🧾 User — view own
router.get('/my', protect, getUserOrders);

export default router;
