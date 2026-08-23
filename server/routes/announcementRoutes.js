const express = require('express');
const router = express.Router();
const {
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement
} = require('../controllers/announcementController');
const { protect, requireRepresentative } = require('../middleware/authMiddleware');

router.get('/', getAnnouncements);
router.post('/', protect, requireRepresentative, createAnnouncement);
router.delete('/:id', protect, requireRepresentative, deleteAnnouncement);

module.exports = router;
