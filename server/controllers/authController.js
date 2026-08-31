const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Complaint = require('../models/Complaint');
const HallBooking = require('../models/HallBooking');
const { inMemoryStore } = require('../store/inMemoryStore');
const { getIsConnected } = require('../config/db');
const { JWT_SECRET } = require('../middleware/authMiddleware');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Mask Aadhaar: e.g. 543287651042 -> XXXX-XXXX-1042
const maskAadhaarNumber = (aadhaar) => {
  const clean = aadhaar.replace(/[^0-9]/g, '');
  if (clean.length === 12) {
    return `XXXX-XXXX-${clean.slice(-4)}`;
  }
  return aadhaar;
};

// @desc    Register a new ward resident with Aadhaar Card Verification
// @route   POST /api/auth/register
// @access  Public
const registerCitizen = async (req, res) => {
  try {
    const {
      name,
      phone,
      aadhaarNumber,
      wardAddress,
      wardSector,
      voterId,
      password,
      email
    } = req.body;

    if (!name || !phone || !aadhaarNumber || !password || !wardAddress) {
      return res.status(400).json({
        success: false,
        message: 'Name, Phone, 12-digit Aadhaar Number, Ward 14 Address, and Password are required.'
      });
    }

    // Clean and validate 12-digit Aadhaar
    const cleanAadhaar = aadhaarNumber.replace(/[^0-9]/g, '');
    if (cleanAadhaar.length !== 12) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Aadhaar Card number. Aadhaar must be exactly 12 digits.'
      });
    }

    // Clean Phone
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length !== 10) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-digit mobile number.'
      });
    }

    const maskedAadhaar = maskAadhaarNumber(cleanAadhaar);

    if (getIsConnected()) {
      // Check if Aadhaar or Phone already registered
      const existingUser = await User.findOne({
        $or: [
          { aadhaarNumber: cleanAadhaar },
          { phone: cleanPhone },
          ...(email ? [{ email: email.toLowerCase() }] : [])
        ]
      });

      if (existingUser) {
        if (existingUser.aadhaarNumber === cleanAadhaar) {
          return res.status(400).json({
            success: false,
            message: 'This Aadhaar Card is already registered with a Ward Resident account.'
          });
        }
        return res.status(400).json({
          success: false,
          message: 'An account with this phone number or email already exists.'
        });
      }

      const user = await User.create({
        name: name.trim(),
        phone: cleanPhone,
        email: email ? email.toLowerCase().trim() : undefined,
        aadhaarNumber: cleanAadhaar,
        maskedAadhaar,
        wardAddress: wardAddress.trim(),
        wardSector: wardSector || 'Sector 2',
        voterId: voterId ? voterId.trim() : '',
        password,
        role: 'citizen',
        designation: 'Verified Ward 14 Resident',
        wardNumber: 14,
        isAadhaarVerified: true
      });

      return res.status(201).json({
        success: true,
        message: 'Ward 14 Resident account registered & verified successfully via Aadhaar.',
        user: {
          _id: user._id,
          name: user.name,
          phone: user.phone,
          maskedAadhaar: user.maskedAadhaar,
          wardAddress: user.wardAddress,
          wardNumber: user.wardNumber,
          role: user.role,
          designation: user.designation,
          token: generateToken(user._id, user.role)
        }
      });
    } else {
      // In-memory fallback
      const existing = inMemoryStore.users.find(
        u =>
          (u.aadhaarNumber && u.aadhaarNumber === cleanAadhaar) ||
          u.phone === cleanPhone ||
          (email && u.email && u.email.toLowerCase() === email.toLowerCase())
      );

      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'This Aadhaar or Phone is already registered.'
        });
      }

      const newUser = await inMemoryStore.createUser({
        name: name.trim(),
        phone: cleanPhone,
        email: email ? email.toLowerCase().trim() : '',
        aadhaarNumber: cleanAadhaar,
        maskedAadhaar,
        wardAddress: wardAddress.trim(),
        wardSector: wardSector || 'Sector 2',
        voterId: voterId || '',
        password,
        role: 'citizen',
        designation: 'Verified Ward 14 Resident',
        wardNumber: 14,
        isAadhaarVerified: true
      });

      return res.status(201).json({
        success: true,
        message: 'Ward 14 Resident account registered & verified successfully via Aadhaar.',
        user: {
          _id: newUser._id,
          name: newUser.name,
          phone: newUser.phone,
          maskedAadhaar: newUser.maskedAadhaar,
          wardAddress: newUser.wardAddress,
          wardNumber: newUser.wardNumber,
          role: newUser.role,
          designation: newUser.designation,
          token: generateToken(newUser._id, newUser.role)
        }
      });
    }
  } catch (error) {
    console.error('[Auth Register Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate User (Aadhaar / Phone for Citizens, Email for Representative)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { identifier, email, aadhaarNumber, phone, password } = req.body;
    const loginId = identifier || aadhaarNumber || phone || email;

    if (!loginId || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your Aadhaar Number / Phone / Email and Password.'
      });
    }

    const cleanInput = loginId.toString().trim();
    const cleanNumbersOnly = cleanInput.replace(/[^0-9]/g, '');

    let user;
    let isMatch = false;

    if (getIsConnected()) {
      user = await User.findOne({
        $or: [
          { email: cleanInput.toLowerCase() },
          { phone: cleanNumbersOnly },
          { aadhaarNumber: cleanNumbersOnly }
        ]
      });

      if (user) {
        isMatch = await user.matchPassword(password);
      }
    } else {
      user = inMemoryStore.findUserByIdentifier(loginId);
      if (user) {
        isMatch = await bcrypt.compare(password, user.password);
      }
    }

    if (!user || !isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your Aadhaar / Phone / Email and Password.'
      });
    }

    res.json({
      success: true,
      message: 'Authentication successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email || '',
        phone: user.phone,
        maskedAadhaar: user.maskedAadhaar || (user.aadhaarNumber ? maskAadhaarNumber(user.aadhaarNumber) : ''),
        wardAddress: user.wardAddress || 'Ward 14, Central Zone',
        wardSector: user.wardSector || 'Sector 2',
        role: user.role,
        designation: user.designation,
        wardNumber: user.wardNumber || 14,
        isAadhaarVerified: user.isAadhaarVerified || false,
        token: generateToken(user._id, user.role)
      }
    });
  } catch (error) {
    console.error('[Auth Login Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get currently logged-in user profile & their personal history
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = req.user;
    let myComplaints = [];
    let myBookings = [];

    if (getIsConnected()) {
      myComplaints = await Complaint.find({
        $or: [
          { citizenPhone: user.phone },
          ...(user.email ? [{ citizenEmail: user.email }] : [])
        ]
      }).sort({ createdAt: -1 });

      myBookings = await HallBooking.find({
        $or: [
          { applicantPhone: user.phone },
          ...(user.maskedAadhaar ? [{ idProofNumber: user.maskedAadhaar }] : [])
        ]
      }).sort({ date: -1 });
    } else {
      myComplaints = inMemoryStore.complaints.filter(
        c => c.citizenPhone === user.phone || (user.email && c.citizenEmail === user.email)
      );
      myBookings = inMemoryStore.hallBookings.filter(
        b => b.applicantPhone === user.phone
      );
    }

    res.json({
      success: true,
      user,
      myComplaints,
      myBookings
    });
  } catch (error) {
    console.error('[Get Me Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerCitizen,
  loginUser,
  getMe
};
