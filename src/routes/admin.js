import express from 'express';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roles.js';
import User from '../models/User.js';
const router = express.Router();

router.get('/users', protect, authorize('admin'), async (req, res) => {
  const users = await User.find().select('-password');
  res.json({ users });
});

// router.get("/users", authMiddleware, adminController.getAllUsers);


export default router;
