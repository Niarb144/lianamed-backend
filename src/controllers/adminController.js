import User from '../models/User.js';

export const getAllUsers = async (req, res) => {
  try {
    // Fetch all users, excluding sensitive info like passwords
    const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 });

    // Optional: If no users found
    if (!users || users.length === 0) {
      return res.status(200).json({ users: [], message: "No users found" });
    }

    res.status(200).json({ users });
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    res.status(500).json({ message: "Server error while fetching users" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const updated = await User.findByIdAndUpdate(id, updates, { new: true });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update user" });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await User.findByIdAndDelete(id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


