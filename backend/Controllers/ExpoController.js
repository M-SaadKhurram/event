const Expo = require("../Models/Expo");

// Create Expo
exports.createExpo = async (req, res) => {
  try {
    const { date, floors } = req.body;

    // Check if an expo already exists on the same date and floor
    const existingExpo = await Expo.findOne({
      date: new Date(date),
      floors: parseInt(floors)
    });

    if (existingExpo) {
      return res.status(400).json({ 
        message: `An expo already exists on ${new Date(date).toLocaleDateString()} for ${floors} floor(s). Please choose a different date or number of floors.`,
        conflictingExpo: {
          title: existingExpo.title,
          date: existingExpo.date,
          floors: existingExpo.floors
        }
      });
    }

    let attachment = null;
    if (req.file) {
      attachment = req.file.path.replace(/\\/g, "/"); // Normalize path for Windows
    }

    const expo = new Expo({
      ...req.body,
      attachment
    });

    await expo.save();
    res.status(201).json({ message: "Expo created successfully", expo });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get All Expos
exports.getAllExpos = async (req, res) => {
  try {
    const expos = await Expo.find();
    res.status(200).json(expos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Single Expo
exports.getExpoById = async (req, res) => {
  try {
    const expo = await Expo.findById(req.params.id);
    if (!expo) return res.status(404).json({ message: "Expo not found" });
    res.status(200).json(expo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Expo
exports.updateExpo = async (req, res) => {
  try {
    const { date, floors } = req.body;
    const expoId = req.params.id;

    // Check if another expo exists on the same date and floor (excluding current expo)
    const existingExpo = await Expo.findOne({
      _id: { $ne: expoId }, // Exclude current expo from check
      date: new Date(date),
      floors: parseInt(floors)
    });

    if (existingExpo) {
      return res.status(400).json({ 
        message: `Another expo already exists on ${new Date(date).toLocaleDateString()} for ${floors} floor(s). Please choose a different date or number of floors.`,
        conflictingExpo: {
          title: existingExpo.title,
          date: existingExpo.date,
          floors: existingExpo.floors
        }
      });
    }

    let attachment = null;
    if (req.file) {
      attachment = req.file.path.replace(/\\/g, "/");
    }

    const updatedData = {
      ...req.body,
    };
    if (attachment) updatedData.attachment = attachment;

    const expo = await Expo.findByIdAndUpdate(expoId, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!expo) return res.status(404).json({ message: "Expo not found" });
    res.status(200).json({ message: "Expo updated successfully", expo });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Expo
exports.deleteExpo = async (req, res) => {
  try {
    const expo = await Expo.findByIdAndDelete(req.params.id);
    if (!expo) return res.status(404).json({ message: "Expo not found" });
    res.status(200).json({ message: "Expo deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Available Floors for a Date (helper endpoint)
exports.getAvailableFloors = async (req, res) => {
  try {
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    // Get all expos on the given date
    const existingExpos = await Expo.find({
      date: new Date(date)
    }).select('floors');

    // Get occupied floors
    const occupiedFloors = existingExpos.map(expo => expo.floors);
    
    // All possible floors
    const allFloors = [1, 2, 3, 4];
    
    // Available floors
    const availableFloors = allFloors.filter(floor => !occupiedFloors.includes(floor));

    res.status(200).json({
      availableFloors,
      occupiedFloors,
      date: new Date(date).toLocaleDateString()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
