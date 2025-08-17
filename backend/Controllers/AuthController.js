const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const UserModel = require("../Models/User"); // ensure correct case
const { ALLOWED_ROLES } = require("../Models/User");
const nodemailer = require('nodemailer');

const EMAIL_USER = process.env.EMAIL_USER
const EMAIL_PASS = process.env.EMAIL_PASS
const EMAIL_FROM = process.env.EMAIL_FROM || EMAIL_USER

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

const forgotPassword = async (req, res) => {
  const { email } = req.body
  try {
    const user = await UserModel.findOne({ email })
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

     user.password = await bcrypt.hash('12345678', 10)
    await user.save()

    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
      }
    })

    const mailOptions = {
      from: EMAIL_FROM,
      to: user.email,
      subject: 'Your password has been reset',
      text: `Hello ${user.name || ''},\n\nYour password has been reset to: 12345678\nPlease login and change your password.\n\nRegards,\nEvent Team`
    }

    await transporter.sendMail(mailOptions)

    res.json({ success: true, message: 'Password reset and email sent' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

const changePassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body
  try {
    const user = await UserModel.findOne({ email })
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password)
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Old password is incorrect' })
    }

    user.password = await bcrypt.hash(newPassword, 10)
    await user.save()

    res.json({ success: true, message: 'Password changed successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

module.exports = {
  signup,
  login,
  forgotPassword,
  changePassword
};
