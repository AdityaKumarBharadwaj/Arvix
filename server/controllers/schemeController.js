const Scheme = require('../models/Scheme');
const { inMemoryStore } = require('../store/inMemoryStore');
const { getIsConnected } = require('../config/db');

// @desc    Get all government schemes with filtering
// @route   GET /api/schemes
// @access  Public
const getAllSchemes = async (req, res) => {
  try {
    const { category, search } = req.query;

    if (getIsConnected()) {
      const query = { isActive: true };
      if (category && category !== 'All') {
        query.category = category;
      }
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { shortDescription: { $regex: search, $options: 'i' } },
          { department: { $regex: search, $options: 'i' } }
        ];
      }
      const schemes = await Scheme.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, count: schemes.length, schemes });
    } else {
      const schemes = inMemoryStore.getSchemes({ category, search });
      return res.json({ success: true, count: schemes.length, schemes });
    }
  } catch (error) {
    console.error('[Get Schemes Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single scheme full details & application guide
// @route   GET /api/schemes/:id
// @access  Public
const getSchemeById = async (req, res) => {
  try {
    const { id } = req.params;

    let scheme;
    if (getIsConnected()) {
      scheme = await Scheme.findOne({
        $or: [
          { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null },
          { slug: id }
        ]
      });
    } else {
      scheme = inMemoryStore.getSchemeById(id);
    }

    if (!scheme) {
      return res.status(404).json({ success: false, message: 'Scheme not found' });
    }

    res.json({ success: true, scheme });
  } catch (error) {
    console.error('[Get Scheme By Id Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new government scheme (Ward Representative / Admin)
// @route   POST /api/schemes
// @access  Private (Ward Representative / Admin)
const createScheme = async (req, res) => {
  try {
    const {
      title,
      category,
      department,
      badge,
      shortDescription,
      fullDescription,
      benefits,
      eligibility,
      documentsRequired,
      applicationSteps,
      officialPortalUrl,
      offlineLocation
    } = req.body;

    if (!title || !category || !department || !shortDescription || !fullDescription) {
      return res.status(400).json({
        success: false,
        message: 'Please provide Title, Category, Department, Short Description, and Full Description.'
      });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const schemeData = {
      title,
      slug: slug + '-' + Math.floor(100 + Math.random() * 900),
      category,
      department,
      badge: badge || 'Direct Benefit',
      shortDescription,
      fullDescription,
      benefits: Array.isArray(benefits) ? benefits : [benefits].filter(Boolean),
      eligibility: Array.isArray(eligibility) ? eligibility : [eligibility].filter(Boolean),
      documentsRequired: Array.isArray(documentsRequired) ? documentsRequired : [documentsRequired].filter(Boolean),
      applicationSteps: applicationSteps || [],
      officialPortalUrl: officialPortalUrl || '',
      offlineLocation: offlineLocation || 'Ward Helpdesk Counter No. 3',
      isActive: true
    };

    let newScheme;
    if (getIsConnected()) {
      newScheme = await Scheme.create(schemeData);
    } else {
      newScheme = inMemoryStore.createScheme(schemeData);
    }

    res.status(201).json({
      success: true,
      message: 'Government scheme added successfully',
      scheme: newScheme
    });
  } catch (error) {
    console.error('[Create Scheme Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllSchemes,
  getSchemeById,
  createScheme
};
