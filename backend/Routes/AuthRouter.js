const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../Middlewares/Auth'); // Changed from './Middlewares/Auth' to '../Middlewares/Auth'
const requireRole = require('../Middlewares/RequireRole'); // Also fix this one

// Import the controller functions
const { signup, login } = require('../Controllers/AuthController');

// Import validation middleware
const { signupValidation, loginValidation } = require('../Middlewares/AuthValidation');

// User registration and login
router.post('/signup', signupValidation, signup); // Signup route
router.post('/login', loginValidation, login);     // Login route

// // Expo and Exhibitor routes with role-based access
// // Only Admin/Organizer can create expos
// router.post('/expos', 
//   ensureAuthenticated, 
//   requireRole("Admin/Organizer"), 
//   createExpoHandler  // Assuming this is defined in your controller
// );

// // Exhibitor-only endpoint
// router.post('/exhibitors/profile', 
//   ensureAuthenticated, 
//   requireRole("Exhibitor"), 
//   saveExhibitorProfile  // Assuming this is defined in your controller
// );

module.exports = router;
