const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const UserModel = require("../Models/User"); // ensure correct case
const { ALLOWED_ROLES } = require("../Models/User");

const signJwt = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

const signup = async (req, res) => {
  try {
    const { name, email, password, role = "Attendee" } = req.body;

    // Validate role again server-side (defense-in-depth)
    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({ message: 'Invalid role', success: false });
    }

    // Check for existing user
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: 'User already exists. Please login.',
        success: false
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save new user
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();

    // Generate token (include role)
    const token = signJwt({
      _id: newUser._id,
      email: newUser.email,
      role: newUser.role
    });

    res.status(201).json({
      message: 'Signup successful',
      success: true,
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Internal Server Error',
      success: false
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    const errorMessage = 'Authentication failed. Email or password is incorrect';

    if (!user) {
      return res.status(403).json({ message: errorMessage, success: false });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(403).json({ message: errorMessage, success: false });
    }

    const token = signJwt({
      _id: user._id,
      email: user.email,
      role: user.role
    });

    res.status(200).json({
      message: 'Login successful',
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Internal Server Error',
      success: false
    });
  }
};

module.exports = {
  signup,
  login
};
