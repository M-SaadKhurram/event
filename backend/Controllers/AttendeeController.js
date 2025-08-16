const Attendee = require('../Models/Attendee');
const Expo = require('../Models/Expo');
const { validationResult } = require('express-validator');

// Register a new attendee
const registerAttendee = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const {
      expo_id,
      full_name,
      email,
      phone,
      organization
    } = req.body;

    // Check if expo exists
    const expo = await Expo.findById(expo_id);
    if (!expo) {
      return res.status(404).json({
        success: false,
        message: 'Expo not found'
      });
    }

    // Check if attendee already registered for this expo
    const existingAttendee = await Attendee.findOne({
      email: email.toLowerCase(),
      expo_id
    });

    if (existingAttendee) {
      return res.status(409).json({
        success: false,
        message: 'Attendee already registered for this expo'
      });
    }

    // Handle file upload if present
    let attachmentPath = null;
    if (req.file) {
      attachmentPath = req.file.path;
    }

    // Create new attendee
    const attendee = new Attendee({
      expo_id,
      full_name: full_name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone ? phone.trim() : undefined,
      organization: organization ? organization.trim() : undefined,
      attachment: attachmentPath
    });

    await attendee.save();

    // Populate expo details for response
    await attendee.populate('expo_id', 'title date location');

    res.status(201).json({
      success: true,
      message: 'Attendee registered successfully',
      data: {
        id: attendee._id,
        expo_id: attendee.expo_id,
        full_name: attendee.full_name,
        email: attendee.email,
        phone: attendee.phone,
        organization: attendee.organization,
        badge_id: attendee.badge_id,
        status: attendee.status,
        registration_date: attendee.registration_date
      }
    });

  } catch (error) {
    console.error('Error registering attendee:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Attendee already registered for this expo'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get all attendees for an expo
const getAttendeesByExpo = async (req, res) => {
  try {
    const { expo_id } = req.params;

    // Validate expo exists
    const expo = await Expo.findById(expo_id);
    if (!expo) {
      return res.status(404).json({
        success: false,
        message: 'Expo not found'
      });
    }

    const attendees = await Attendee.find({ expo_id })
      .populate('expo_id', 'title date location')
      .sort({ registration_date: -1 });

    res.json({
      success: true,
      data: attendees
    });

  } catch (error) {
    console.error('Error fetching attendees:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get attendee by ID
const getAttendeeById = async (req, res) => {
  try {
    const { id } = req.params;

    const attendee = await Attendee.findById(id)
      .populate('expo_id', 'title date location');

    if (!attendee) {
      return res.status(404).json({
        success: false,
        message: 'Attendee not found'
      });
    }

    res.json({
      success: true,
      data: attendee
    });

  } catch (error) {
    console.error('Error fetching attendee:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update attendee status (check-in, cancel, etc.)
const updateAttendeeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['registered', 'cancelled', 'checked_in'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: registered, cancelled, checked_in'
      });
    }

    const attendee = await Attendee.findById(id);
    if (!attendee) {
      return res.status(404).json({
        success: false,
        message: 'Attendee not found'
      });
    }

    attendee.status = status;
    await attendee.save();

    // Populate expo details for response
    await attendee.populate('expo_id', 'title date location');

    res.json({
      success: true,
      message: 'Attendee status updated successfully',
      data: attendee
    });

  } catch (error) {
    console.error('Error updating attendee status:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get attendee by badge ID (for check-in)
const getAttendeeByBadgeId = async (req, res) => {
  try {
    const { badge_id } = req.params;

    const attendee = await Attendee.findOne({ badge_id })
      .populate('expo_id', 'title date location');

    if (!attendee) {
      return res.status(404).json({
        success: false,
        message: 'Attendee not found'
      });
    }

    res.json({
      success: true,
      data: attendee
    });

  } catch (error) {
    console.error('Error fetching attendee by badge ID:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  registerAttendee,
  getAttendeesByExpo,
  getAttendeeById,
  updateAttendeeStatus,
  getAttendeeByBadgeId
};