import Medicine from '../models/Medicine.js';

// Add new medicine (Admin only)
export const addMedicine = async (req, res) => {
  try {
    const { name, category, description, price, stock } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: 'Name and price are required' });
    }

    const medicine = new Medicine({ name, category, description, price, stock });
    await medicine.save();

    res.status(201).json({ message: 'Medicine added successfully', medicine });
  } catch (error) {
    console.error('Add medicine error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find().sort({ createdAt: -1 });
    res.json(medicines);
  } catch (error) {
    console.error('Fetch medicines error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update medicine
export const updateMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Medicine.findByIdAndUpdate(id, req.body, { new: true });

    if (!updated) return res.status(404).json({ message: "Medicine not found" });
    res.json({ message: "Medicine updated successfully", medicine: updated });
  } catch (error) {
    console.error("Update medicine error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete medicine
export const deleteMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Medicine.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ message: "Medicine not found" });
    res.json({ message: "Medicine deleted successfully" });
  } catch (error) {
    console.error("Delete medicine error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
