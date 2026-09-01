const HallBooking = require('../models/HallBooking');
const { inMemoryStore } = require('../store/inMemoryStore');
const { getIsConnected } = require('../config/db');

// @desc    Get booked dates for calendar visualization
// @route   GET /api/hall-bookings/calendar
// @access  Public
const getCalendarAvailability = async (req, res) => {
  try {
    const { year, month } = req.query; // optional YYYY and MM filters

    let bookings = [];
    if (getIsConnected()) {
      bookings = await HallBooking.find({
        status: { $in: ['Confirmed', 'Pending'] }
      }).select('date eventType status applicantName');
    } else {
      bookings = inMemoryStore.getHallBookings().filter(
        b => b.status === 'Confirmed' || b.status === 'Pending'
      );
    }

    // Map booked dates dictionary: { '2026-11-12': { status: 'Confirmed', eventType: 'Marriage' } }
    const bookedDates = {};
    bookings.forEach(b => {
      bookedDates[b.date] = {
        date: b.date,
        status: b.status, // Confirmed (Red), Pending (Amber)
        eventType: b.eventType,
        hallName: b.hallName || 'Ward 14 Community Vivah Bhavan'
      };
    });

    res.json({
      success: true,
      hallDetails: {
        name: 'Ward 14 Community Vivah Bhavan & Banquet',
        capacity: 850,
        diningCapacity: 350,
        amenities: [
          'Central Air Conditioning',
          'Eco-friendly Solar & 24/7 Generator Backup',
          'Dedicated Groom & Bride AC Green Rooms',
          'Commercial Kitchen with Gas Pipeline',
          'Covered Parking for 120 4-wheelers & 250 2-wheelers',
          'RO Drinking Water Plant',
          'CCTV Security & Fire Safety'
        ],
        subsidizedTariffPerDay: '₹12,000 (Resident Subsidized Rate)',
        securityDeposit: '₹5,000 (Refundable)'
      },
      bookedDates
    });
  } catch (error) {
    console.error('[Get Calendar Availability Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit a marriage / event hall booking request
// @route   POST /api/hall-bookings
// @access  Public
const createBookingRequest = async (req, res) => {
  try {
    const {
      applicantName,
      applicantPhone,
      applicantEmail,
      applicantAddress,
      eventType,
      date,
      guestCount,
      idProofType,
      idProofNumber
    } = req.body;

    if (!applicantName || !applicantPhone || !applicantAddress || !eventType || !date || !guestCount || !idProofNumber) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all mandatory booking fields.'
      });
    }

    // Check if date is already confirmed
    let existing;
    if (getIsConnected()) {
      existing = await HallBooking.findOne({ date, status: 'Confirmed' });
    } else {
      existing = inMemoryStore.hallBookings.find(b => b.date === date && b.status === 'Confirmed');
    }

    if (existing) {
      return res.status(409).json({
        success: false,
        message: `Date ${date} is already confirmed for another event. Please select an available free date.`
      });
    }

    const bookingData = {
      hallName: 'Ward 14 Community Vivah Bhavan',
      applicantName,
      applicantPhone,
      applicantEmail: applicantEmail || '',
      applicantAddress,
      eventType,
      date,
      guestCount: Number(guestCount),
      idProofType: idProofType || 'Aadhaar Card',
      idProofNumber,
      status: 'Pending',
      adminRemark: 'Booking request registered. Pending verification of resident address proof.'
    };

    let newBooking;
    if (getIsConnected()) {
      newBooking = await HallBooking.create(bookingData);
    } else {
      newBooking = inMemoryStore.createHallBooking(bookingData);
    }

    res.status(201).json({
      success: true,
      message: `Reservation request for ${date} registered successfully. Ward office will review within 24 hours.`,
      booking: newBooking
    });
  } catch (error) {
    console.error('[Create Booking Request Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all bookings (Ward Representative / Admin)
// @route   GET /api/hall-bookings
// @access  Private (Ward Representative / Admin)
const getAllBookings = async (req, res) => {
  try {
    let list = [];
    if (getIsConnected()) {
      list = await HallBooking.find({}).sort({ date: 1 });
    } else {
      list = inMemoryStore.getHallBookings();
    }

    res.json({
      success: true,
      count: list.length,
      bookings: list
    });
  } catch (error) {
    console.error('[Get All Bookings Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update booking status (Confirm or Reject)
// @route   PATCH /api/hall-bookings/:id/status
// @access  Private (Ward Representative / Admin)
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminRemark } = req.body;

    if (!['Confirmed', 'Rejected', 'Cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Choose Confirmed, Rejected, or Cancelled.'
      });
    }

    let updated;
    if (getIsConnected()) {
      const booking = await HallBooking.findById(id);
      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }
      booking.status = status;
      if (adminRemark) booking.adminRemark = adminRemark;
      updated = await booking.save();
    } else {
      updated = inMemoryStore.updateHallBooking(id, status, adminRemark);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }
    }

    res.json({
      success: true,
      message: `Hall booking updated to ${status}`,
      booking: updated
    });
  } catch (error) {
    console.error('[Update Booking Status Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCalendarAvailability,
  createBookingRequest,
  getAllBookings,
  updateBookingStatus
};
