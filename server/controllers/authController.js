const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { inMemoryStore } = require('../store/inMemoryStore');
const { getIsConnected } = require('../config/db');
const { JWT_SECRET } = require('../middleware/authMiddleware');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register a new citizen
// @route   POST /api/auth/register
// @access  Public
const registerCitizen = async (req, res) => {
  try {
    const { name, email, phone, password, address } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (name, email, phone, password)'
      });
    }

    if (getIsConnected()) {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User with this email already exists' });
      }

      const user = await User.create({
        name,
        email,
        phone,
        password,
        role: 'citizen',
        designation: 'Ward Resident'
      });

      return res.status(201).json({
        success: true,
        message: 'Registration successful',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          designation: user.designation,
          token: generateToken(user._id, user.role)
        }
      });
    } else {
      const existing = inMemoryStore.findUserByEmail(email);
      if (existing) {
        return res.status(400).json({ success: false, message: 'User with this email already exists' });
      }

      const user = await inMemoryStore.createUser({
        name,
        email,
        phone,
        password,
        role: 'citizen',
        designation: 'Ward Resident'
      });

      return res.status(201).json({
        success: true,
        message: 'Registration successful',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          designation: user.designation,
          token: generateToken(user._id, user.role)
        }
      });
    }
  } catch (error) {
    console.error('[Auth Register Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate user (Citizen or Ward Representative)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    let user;
    let isMatch = false;

    if (getIsConnected()) {
      user = await User.findOne({ email });
      if (user) {
        isMatch = await user.matchPassword(password);
      }
    } else {
      user = inMemoryStore.findUserByEmail(email);
      if (user) {
        const bcrypt = require('bcryptjs');
        isMatch = await bcrypt.compare(password, user.password);
      }
    }

    if (!user || !isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        designation: user.designation,
        wardNumber: user.wardNumber || 14,
        token: generateToken(user._id, user.role)
      }
    });
  } catch (error) {
    console.error('[Auth Login Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get currently logged-in user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
};

module.exports = {
  registerCitizen,
  loginUser,
  getMe
};
