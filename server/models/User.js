const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    sparse: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  // 12-digit Aadhaar Card Number (Essential for Anti-Spam & Ward Residency Verification)
  aadhaarNumber: {
    type: String,
    trim: true,
    sparse: true
  },
  maskedAadhaar: {
    type: String,
    trim: true
  },
  isAadhaarVerified: {
    type: Boolean,
    default: true
  },
  wardAddress: {
    type: String,
    default: 'Ward No. 14, Central Zone'
  },
  wardSector: {
    type: String,
    default: 'Sector 2'
  },
  voterId: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  role: {
    type: String,
    enum: ['citizen', 'representative', 'admin'],
    default: 'citizen'
  },
  designation: {
    type: String,
    default: 'Verified Ward 14 Resident'
  },
  wardNumber: {
    type: Number,
    default: 14
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre('save', async function (next) {
  if (this.aadhaarNumber && !this.maskedAadhaar) {
    const clean = this.aadhaarNumber.replace(/[^0-9]/g, '');
    if (clean.length === 12) {
      this.maskedAadhaar = `XXXX-XXXX-${clean.slice(-4)}`;
    }
  }

  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
