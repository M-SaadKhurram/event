const mongoose = require('mongoose');

const attendeeSchema = new mongoose.Schema({
  expo_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expo',
    required: true
  },
  full_name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(email) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
      },
      message: 'Please enter a valid email'
    }
  },
  phone: {
    type: String,
    validate: {
      validator: function(phone) {
        return !phone || /^\d{10,15}$/.test(phone.replace(/\D/g, ''));
      },
      message: 'Please enter a valid phone number'
    }
  },
  registration_date: {
    type: Date,
    default: Date.now
  },
  organization: {
    type: String,
    trim: true,
    maxlength: 100
  },
  badge_id: {
    type: String,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  status: {
    type: String,
    enum: ['registered', 'cancelled', 'checked_in'],
    default: 'registered'
  },
  attachment: {
    type: String // File path for uploaded documents
  }
}, { 
  timestamps: true 
});

// Ensure email is unique per expo
attendeeSchema.index({ email: 1, expo_id: 1 }, { unique: true });

// Virtual for attendee ID
attendeeSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

// Ensure virtual fields are serialized
attendeeSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Attendee', attendeeSchema);