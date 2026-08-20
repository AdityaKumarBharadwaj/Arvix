const express = require('express');
const router = express.Router();
const { registerCitizen, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerCitizen);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

module.exports = router;
