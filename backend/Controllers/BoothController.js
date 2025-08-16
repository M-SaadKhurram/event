const Booth = require("../Models/Booth");
const Expo = require("../Models/Expo");

// Create Booth - Only Admin
exports.createBooth = async (req, res) => {
  try {
    // Validate expo exists
    const expo = await Expo.findById(req.body.expo_id);
    if (!expo) {
      return res.status(404).json({ message: "Expo not found" });
    }

    // Validate floor is within expo's floor range
    if (req.body.floor > expo.floors) {
      return res.status(400).json({ 
        message: `Floor ${req.body.floor} is not available for this expo. Maximum floors: ${expo.floors}` 
      });
    }

    const booth = new Booth(req.body);
    await booth.save();
    
    // Populate expo details in response
    await booth.populate('expo_id', 'title date location floors');
    
    res.status(201).json({ message: "Booth created successfully", booth });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: "Booth number already exists on this floor for this expo" 
      });
    }
    res.status(400).json({ message: error.message });
  }
};

// Get All Booths
exports.getBooths = async (req, res) => {
  try {
    const { expo_id, floor, status } = req.query;
    
    let filter = {};
    if (expo_id) filter.expo_id = expo_id;
    if (floor) filter.floor = parseInt(floor);
    if (status) filter.status = status;

    const booths = await Booth.find(filter)
      .populate("assigned_to", "name email role")
      .populate("expo_id", "title date location floors")
      .sort({ expo_id: 1, floor: 1, booth_number: 1 });
    
    res.json(booths);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Available Booths for Expo
exports.getAvailableBoothsForExpo = async (req, res) => {
  try {
    const { expo_id } = req.params;
    const { floor } = req.query;

    // Validate expo exists
    const expo = await Expo.findById(expo_id);
    if (!expo) {
      return res.status(404).json({ message: "Expo not found" });
    }

    let filter = { 
      expo_id, 
      status: 'available',
      assigned_to: null 
    };
    
    if (floor) {
      filter.floor = parseInt(floor);
    }

    const availableBooths = await Booth.find(filter)
      .populate("expo_id", "title date location floors")
      .sort({ floor: 1, booth_number: 1 });

    res.json({
      expo: {
        id: expo._id,
        title: expo.title,
        date: expo.date,
        floors: expo.floors
      },
      availableBooths,
      totalAvailable: availableBooths.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Booths by Expo and Floor
exports.getBoothsByExpoAndFloor = async (req, res) => {
  try {
    const { expo_id, floor } = req.params;

    const booths = await Booth.find({ 
      expo_id, 
      floor: parseInt(floor) 
    })
      .populate("assigned_to", "name email role")
      .populate("expo_id", "title date location floors")
      .sort({ booth_number: 1 });

    res.json(booths);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Booth by ID
exports.getBoothById = async (req, res) => {
  try {
    const booth = await Booth.findById(req.params.id)
      .populate("assigned_to", "name email role")
      .populate("expo_id", "title date location floors");
    
    if (!booth) return res.status(404).json({ message: "Booth not found" });
    res.json(booth);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Booth
exports.updateBooth = async (req, res) => {
  try {
    // If expo_id is being updated, validate it exists
    if (req.body.expo_id) {
      const expo = await Expo.findById(req.body.expo_id);
      if (!expo) {
        return res.status(404).json({ message: "Expo not found" });
      }

      // Validate floor is within expo's floor range
      if (req.body.floor && req.body.floor > expo.floors) {
        return res.status(400).json({ 
          message: `Floor ${req.body.floor} is not available for this expo. Maximum floors: ${expo.floors}` 
        });
      }
    }

    const booth = await Booth.findByIdAndUpdate(req.params.id, req.body, { 
      new: true,
      runValidators: true 
    })
      .populate("assigned_to", "name email role")
      .populate("expo_id", "title date location floors");

    if (!booth) return res.status(404).json({ message: "Booth not found" });
    res.json({ message: "Booth updated successfully", booth });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: "Booth number already exists on this floor for this expo" 
      });
    }
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
