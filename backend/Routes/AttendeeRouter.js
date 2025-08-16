const express = require('express');
const { body } = require('express-validator');
const {
  registerAttendee,
  getAttendeesByExpo,
  getAttendeeById,
  updateAttendeeStatus,
  getAttendeeByBadgeId
} = require('../Controllers/AttendeeController');
const upload = require('../Middlewares/upload');
const Auth = require('../Middlewares/Auth');

const router = express.Router();

// Validation middleware for attendee registration
const validateAttendeeRegistration = [
  body('expo_id')
    .notEmpty()
    .withMessage('Expo ID is required')
    .isMongoId()
    .withMessage('Invalid expo ID format'),
  body('full_name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('organization')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Organization name cannot exceed 100 characters')
];

// Validation for status update
const validateStatusUpdate = [
  body('status')
    .isIn(['registered', 'cancelled', 'checked_in'])
    .withMessage('Status must be one of: registered, cancelled, checked_in')
];

// Routes
// POST /api/attendees/register - Register new attendee
router.post('/register', 
  upload.single('attachment'), 
  validateAttendeeRegistration, 
  registerAttendee
);

// GET /api/attendees/expo/:expo_id - Get all attendees for an expo
router.get('/expo/:expo_id', Auth, getAttendeesByExpo);

// GET /api/attendees/:id - Get attendee by ID
router.get('/:id', Auth, getAttendeeById);

// GET /api/attendees/badge/:badge_id - Get attendee by badge ID
router.get('/badge/:badge_id', Auth, getAttendeeByBadgeId);

// PUT /api/attendees/:id/status - Update attendee status
router.put('/:id/status', Auth, validateStatusUpdate, updateAttendeeStatus);

module.exports = router;