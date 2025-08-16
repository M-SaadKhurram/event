const mongoose = require('mongoose');

const boothSchema = new mongoose.Schema({
  // Add expo relationship
  expo_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Expo',
    required: true 
  },
  assigned_to: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'users', // references Exhibitor from User model
    default: null 
  },
  floor: { 
    type: Number, 
    enum: [1, 2, 3, 4], 
    required: true 
  },
  booth_number: { 
    type: String, 
    required: true 
  },
  length: { 
    type: Number, 
    required: true 
  },
  width: { 
    type: Number, 
    required: true 
  },
  size_unit: { 
    type: String, 
    enum: ['ft', 'm'], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['available', 'reserved', 'booked', 'under_maintenance'], 
    default: 'available' 
  },
  price: { 
    type: mongoose.Decimal128, 
    default: null 
  },
  has_power: { 
    type: Boolean, 
    default: false 
  },
  has_wifi: { 
    type: Boolean, 
    default: false 
  },
  is_corner_booth: { 
    type: Boolean, 
    default: false 
  },
  notes: { 
    type: String, 
    default: '' 
  }
}, { timestamps: true });

// Ensure booth number is unique per floor per expo
boothSchema.index({ expo_id: 1, floor: 1, booth_number: 1 }, { unique: true });

module.exports = mongoose.model('Booth', boothSchema);
