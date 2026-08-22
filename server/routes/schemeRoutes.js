const express = require('express');
const router = express.Router();
const { getAllSchemes, getSchemeById, createScheme } = require('../controllers/schemeController');
const { protect, requireRepresentative } = require('../middleware/authMiddleware');

router.get('/', getAllSchemes);
router.get('/:id', getSchemeById);
router.post('/', protect, requireRepresentative, createScheme);

module.exports = router;
