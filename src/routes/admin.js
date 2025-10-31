import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import { 
    getAllUsers,
    updateUser,
    deleteUser
} from '../controllers/adminController.js';
import { authorize } from '../middleware/roles.js';
import User from '../models/User.js';
const router = express.Router();

router.get('/users', protect, authorize('admin'), async (req, res) => {
  const users = await User.find().select('-password');
  res.json({ users });
});

// router.get("/users", authMiddleware, adminController.getAllUsers);
router.get("/users", protect, adminOnly, getAllUsers);
router.put("/users/:id", protect, adminOnly, updateUser);
router.delete("/users/:id", protect, adminOnly, deleteUser);

export default router;
