const express = require('express');
const router = express.Router();
const {
  getCalendarAvailability,
  createBookingRequest,
  getAllBookings,
  updateBookingStatus
} = require('../controllers/hallBookingController');
const { protect, requireRepresentative } = require('../middleware/authMiddleware');

router.get('/calendar', getCalendarAvailability);
router.post('/', createBookingRequest);
router.get('/', protect, requireRepresentative, getAllBookings);
router.patch('/:id/status', protect, requireRepresentative, updateBookingStatus);

module.exports = router;
