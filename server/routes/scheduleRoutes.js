const express = require('express');
const router = express.Router();
const {
  getMedicineSchedule,
  updateMedicineSchedule,
  getRationSchedule,
  updateRationSchedule
} = require('../controllers/scheduleController');
const { protect, requireRepresentative } = require('../middleware/authMiddleware');

router.get('/medicine', getMedicineSchedule);
router.put('/medicine', protect, requireRepresentative, updateMedicineSchedule);

router.get('/ration', getRationSchedule);
router.put('/ration', protect, requireRepresentative, updateRationSchedule);

module.exports = router;
