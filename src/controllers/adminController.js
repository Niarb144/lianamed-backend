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
  const { id } = req.params;
  const { name, email, role } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { name, email, role },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User updated", user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
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


