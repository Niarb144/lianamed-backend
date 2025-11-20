import Medicine from '../models/Medicine.js';

// Add new medicine (Admin only)
export const addMedicine = async (req, res) => {
  try {
    const { name, category, description, price, stock } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null; // ✅ image path

    const newMedicine = new Medicine({
      name,
      category,
      description,
      price,
      stock,
      image,
    });

    await newMedicine.save();
    res.status(201).json({ message: "Medicine added successfully", medicine: newMedicine });
  } catch (error) {
    console.error("Error adding medicine:", error);
    res.status(500).json({ message: "Failed to add medicine" });
  }
};

export const getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find().sort({ createdAt: -1 });
    res.json(medicines);
    // db.medicines.find({}, { name: 1, image: 1 }).pretty();
  } catch (error) {
    console.error('Fetch medicines error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update medicine
export const updateMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (req.file) updates.image = `/uploads/${req.file.filename}`;

    const updated = await Medicine.findByIdAndUpdate(id, updates, { new: true });
    res.json(updated);
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

// Get medicine by ID
export const getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    res.json(medicine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
