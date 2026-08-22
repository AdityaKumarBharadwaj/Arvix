const mongoose = require('mongoose');

const hallBookingSchema = new mongoose.Schema({
  hallName: {
    type: String,
    default: 'Ward 14 Community Vivah Bhavan',
    trim: true
  },
  applicantName: {
    type: String,
    required: [true, 'Applicant name is required'],
    trim: true
  },
  applicantPhone: {
    type: String,
    required: [true, 'Contact phone is required'],
    trim: true
  },
  applicantEmail: {
    type: String,
    default: ''
  },
  applicantAddress: {
    type: String,
    required: [true, 'Ward resident address is required']
  },
  eventType: {
    type: String,
    required: true,
    enum: ['Marriage', 'Reception', 'Engagement', 'Birthday / Anniversary', 'Community Meeting', 'Other']
  },
  date: {
    type: String, // Stored in YYYY-MM-DD format for easy daily slot queries
    required: [true, 'Booking date is required']
  },
  guestCount: {
    type: Number,
    required: true,
    min: 10,
    max: 1200
  },
  idProofType: {
    type: String,
    enum: ['Aadhaar Card', 'Voter ID', 'Ration Card', 'Driving License'],
    default: 'Aadhaar Card'
  },
  idProofNumber: {
    type: String,
    required: [true, 'Resident ID proof number is required']
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Rejected', 'Cancelled'],
    default: 'Pending'
  },
  adminRemark: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('HallBooking', hallBookingSchema);
