const Booth = require("../Models/Booth");

// Create Booth - Only Admin
exports.createBooth = async (req, res) => {
  try {
    const booth = new Booth(req.body);
    await booth.save();
    res.status(201).json({ message: "Booth created successfully", booth });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get All Booths
exports.getBooths = async (req, res) => {
  try {
    const booths = await Booth.find().populate("assigned_to", "name email role");
    res.json(booths);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Booth by ID
exports.getBoothById = async (req, res) => {
  try {
    const booth = await Booth.findById(req.params.id).populate("assigned_to", "name email role");
    if (!booth) return res.status(404).json({ message: "Booth not found" });
    res.json(booth);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Booth
exports.updateBooth = async (req, res) => {
  try {
    const booth = await Booth.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!booth) return res.status(404).json({ message: "Booth not found" });
    res.json({ message: "Booth updated successfully", booth });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Booth
exports.deleteBooth = async (req, res) => {
  try {
    const booth = await Booth.findByIdAndDelete(req.params.id);
    if (!booth) return res.status(404).json({ message: "Booth not found" });
    res.json({ message: "Booth deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
