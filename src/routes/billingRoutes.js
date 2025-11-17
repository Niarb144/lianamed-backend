import express from 'express';
import { createOrder, getAllOrders, getUserOrders } from '../controllers/billingController.js';
import { adminOnly, protect, verifyPharmacist, adminOrPharmacist } from '../middleware/auth.js';

const router = express.Router();

router.post('/checkout', createOrder);

// 🧾 Pharmacist & Admin — view all
router.get('/all', protect, adminOrPharmacist, getAllOrders);

// // Admin - view all
// router.get('/all', protect, adminOnly, getAllOrders);

// 🧾 User — view own
router.get('/my', protect, getUserOrders);

export default router;
