const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const {
  createComplaint,
  trackComplaint,
  getAllComplaints,
  updateComplaintStatus,
  getComplaintStats
} = require('../controllers/complaintController');
const { protect, requireRepresentative } = require('../middleware/authMiddleware');

router.post('/', upload.array('photos', 4), createComplaint);
router.get('/', getAllComplaints);
router.get('/stats', getComplaintStats);
router.get('/track/:trackingId', trackComplaint);
router.patch('/:id/status', protect, requireRepresentative, updateComplaintStatus);

module.exports = router;
