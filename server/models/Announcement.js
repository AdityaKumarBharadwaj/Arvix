const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Announcement title is required'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  category: {
    type: String,
    enum: ['Emergency Alert', 'Ward Function', 'Public Notice', 'Sanitation Drive', 'Health Camp'],
    default: 'Public Notice'
  },
  urgency: {
    type: String,
    enum: ['Normal', 'Important', 'Urgent'],
    default: 'Normal'
  },
  eventDate: {
    type: String, // e.g. "Sunday, 25 Aug 2026" or ISO string
    default: ''
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Announcement', announcementSchema);
