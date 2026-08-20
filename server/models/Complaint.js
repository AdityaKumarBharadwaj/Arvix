const mongoose = require('mongoose');

const statusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['Submitted', 'Under Review', 'In Progress', 'Completed', 'Rejected'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  note: {
    type: String,
    default: ''
  },
  updatedBy: {
    type: String,
    default: 'System'
  }
}, { _id: false });

const complaintSchema = new mongoose.Schema({
  trackingId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  citizenName: {
    type: String,
    required: [true, 'Citizen name is required'],
    trim: true
  },
  citizenPhone: {
    type: String,
    required: [true, 'Contact phone is required'],
    trim: true
  },
  citizenEmail: {
    type: String,
    default: '',
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Road',
      'Water',
      'Government School',
      'Sanitation',
      'Electricity',
      'Drainage',
      'Other'
    ]
  },
  title: {
    type: String,
    required: [true, 'Subject/Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Detailed description is required']
  },
  landmark: {
    type: String,
    required: [true, 'Landmark / Area is required'],
    trim: true
  },
  wardNumber: {
    type: Number,
    default: 14
  },
  priority: {
    type: String,
    enum: ['Routine', 'High', 'Urgent'],
    default: 'Routine'
  },
  photos: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['Submitted', 'Under Review', 'In Progress', 'Completed', 'Rejected'],
    default: 'Submitted'
  },
  adminRemark: {
    type: String,
    default: ''
  },
  assignedDepartment: {
    type: String,
    default: 'Ward Engineering & Public Works'
  },
  statusHistory: [statusHistorySchema],
  resolvedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Auto-populate status history on initial creation
complaintSchema.pre('save', function (next) {
  if (this.isNew && (!this.statusHistory || this.statusHistory.length === 0)) {
    this.statusHistory = [{
      status: 'Submitted',
      timestamp: new Date(),
      note: 'Grievance received and registered under Ward Portal.',
      updatedBy: 'Citizen Self-Service'
    }];
  }
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Complaint', complaintSchema);
