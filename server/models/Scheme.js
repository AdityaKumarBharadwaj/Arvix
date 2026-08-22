const mongoose = require('mongoose');

const applicationStepSchema = new mongoose.Schema({
  stepNumber: { type: Number, required: true },
  stepTitle: { type: String, required: true },
  instructions: { type: String, required: true }
}, { _id: false });

const schemeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Scheme title is required'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Education',
      'Healthcare',
      'Housing',
      'Women & Child',
      'Senior Citizens',
      'Food & Ration',
      'Agriculture & Livelihood'
    ]
  },
  department: {
    type: String,
    required: true
  },
  badge: {
    type: String,
    default: 'Direct Benefit'
  },
  shortDescription: {
    type: String,
    required: true
  },
  fullDescription: {
    type: String,
    required: true
  },
  benefits: [{
    type: String
  }],
  eligibility: [{
    type: String
  }],
  documentsRequired: [{
    type: String
  }],
  applicationSteps: [applicationStepSchema],
  officialPortalUrl: {
    type: String,
    default: ''
  },
  offlineLocation: {
    type: String,
    default: 'Ward Helpdesk Counter No. 3, Ward Office, Mon-Fri 10:00 AM - 4:00 PM'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Scheme', schemeSchema);
