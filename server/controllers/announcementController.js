const Announcement = require('../models/Announcement');
const { inMemoryStore } = require('../store/inMemoryStore');
const { getIsConnected } = require('../config/db');

// @desc    Get all active announcements & functions
// @route   GET /api/announcements
// @access  Public
const getAnnouncements = async (req, res) => {
  try {
    let list = [];
    if (getIsConnected()) {
      list = await Announcement.find({}).sort({ isPinned: -1, createdAt: -1 });
    } else {
      list = inMemoryStore.getAnnouncements();
    }

    res.json({
      success: true,
      count: list.length,
      announcements: list
    });
  } catch (error) {
    console.error('[Get Announcements Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new ward announcement or function
// @route   POST /api/announcements
// @access  Private (Ward Representative / Admin)
const createAnnouncement = async (req, res) => {
  try {
    const { title, content, category, urgency, eventDate, isPinned } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and Content are required.'
      });
    }

    const itemData = {
      title,
      content,
      category: category || 'Public Notice',
      urgency: urgency || 'Normal',
      eventDate: eventDate || '',
      isPinned: Boolean(isPinned),
      createdAt: new Date()
    };

    let item;
    if (getIsConnected()) {
      item = await Announcement.create(itemData);
    } else {
      item = inMemoryStore.createAnnouncement(itemData);
    }

    res.status(201).json({
      success: true,
      message: 'Announcement posted successfully to citizen board',
      announcement: item
    });
  } catch (error) {
    console.error('[Create Announcement Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete an announcement
// @route   DELETE /api/announcements/:id
// @access  Private (Ward Representative / Admin)
const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      await Announcement.findByIdAndDelete(id);
    } else {
      inMemoryStore.deleteAnnouncement(id);
    }

    res.json({
      success: true,
      message: 'Announcement removed'
    });
  } catch (error) {
    console.error('[Delete Announcement Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement
};
