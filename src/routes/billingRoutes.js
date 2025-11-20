import express from 'express';
import { createOrder, getAllOrders, getUserOrders, updateOrderStatus, payOrder, getOrderById } from '../controllers/billingController.js';
import { adminOnly, protect, adminOrPharmacist } from '../middleware/auth.js';

const router = express.Router();

router.post('/checkout', createOrder);

// 🧾 Pharmacist & Admin — view all
router.get('/all', protect, adminOrPharmacist, getAllOrders);

// 🧾 User — view own
router.get('/my', protect, getUserOrders);

router.get("/:id", protect,getOrderById);

router.put("/:id/status", protect, adminOrPharmacist, updateOrderStatus);

// 💳 Pay for an order
router.put("/:id/pay", protect, payOrder);


export default router;
