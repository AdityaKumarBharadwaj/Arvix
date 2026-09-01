const Complaint = require('../models/Complaint');
const { inMemoryStore } = require('../store/inMemoryStore');
const { getIsConnected } = require('../config/db');

// Helper to generate official-looking tracking ID: ARV-2026-XXXX
const generateTrackingId = () => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `ARV-${year}-${randomNum}`;
};

// @desc    Lodge a new civic complaint
// @route   POST /api/complaints
// @access  Public
const createComplaint = async (req, res) => {
  try {
    const {
      citizenName,
      citizenPhone,
      citizenEmail,
      category,
      title,
      description,
      landmark,
      wardNumber,
      priority
    } = req.body;

    if (!citizenName || !citizenPhone || !category || !title || !description || !landmark) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all mandatory fields (Name, Phone, Category, Title, Description, Landmark).'
      });
    }

    const trackingId = generateTrackingId();

    // Collect uploaded file URLs
    const photos = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        photos.push(`/uploads/${file.filename}`);
      });
    }

    // Default assigned dept based on category
    let assignedDepartment = 'Ward Public Works';
    if (category === 'Water' || category === 'Drainage') assignedDepartment = 'Jal Board & Sanitation';
    else if (category === 'Road') assignedDepartment = 'Municipal Roads & Highway Dept';
    else if (category === 'Government School') assignedDepartment = 'Ward Education & Anganwadi Board';
    else if (category === 'Electricity') assignedDepartment = 'State Electricity Distribution';
    else if (category === 'Sanitation') assignedDepartment = 'Solid Waste & Sanitation Div';

    const complaintData = {
      trackingId,
      citizenName,
      citizenPhone,
      citizenEmail: citizenEmail || '',
      category,
      title,
      description,
      landmark,
      wardNumber: Number(wardNumber) || 14,
      priority: priority || 'Routine',
      photos,
      status: 'Submitted',
      assignedDepartment,
      adminRemark: '',
      statusHistory: [
        {
          status: 'Submitted',
          timestamp: new Date(),
          note: `Grievance registered. Allocated to ${assignedDepartment}.`,
          updatedBy: 'Citizen Portal'
        }
      ]
    };

    let savedComplaint;
    if (getIsConnected()) {
      savedComplaint = await Complaint.create(complaintData);
    } else {
      savedComplaint = inMemoryStore.createComplaint(complaintData);
    }

    res.status(201).json({
      success: true,
      message: 'Grievance submitted successfully. Please retain your Tracking ID for updates.',
      trackingId: savedComplaint.trackingId,
      complaint: savedComplaint
    });
  } catch (error) {
    console.error('[Create Complaint Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Track a complaint by tracking ID or citizen phone
// @route   GET /api/complaints/track/:trackingId
// @access  Public
const trackComplaint = async (req, res) => {
  try {
    const { trackingId } = req.params;
    const cleanId = trackingId.trim();

    let complaint;
    if (getIsConnected()) {
      complaint = await Complaint.findOne({
        $or: [
          { trackingId: cleanId.toUpperCase() },
          { citizenPhone: cleanId }
        ]
      });
    } else {
      complaint = inMemoryStore.complaints.find(
        c => c.trackingId.toUpperCase() === cleanId.toUpperCase() || c.citizenPhone === cleanId
      );
    }

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: `No grievance found with reference number or phone: ${cleanId}`
      });
    }

    res.json({
      success: true,
      complaint
    });
  } catch (error) {
    console.error('[Track Complaint Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all complaints with filters (for Ward Representative)
// @route   GET /api/complaints
// @access  Public or Protected
const getAllComplaints = async (req, res) => {
  try {
    const { status, category, search, priority } = req.query;

    if (getIsConnected()) {
      const query = {};
      if (status && status !== 'All') query.status = status;
      if (category && category !== 'All') query.category = category;
      if (priority && priority !== 'All') query.priority = priority;
      if (search) {
        query.$or = [
          { trackingId: { $regex: search, $options: 'i' } },
          { title: { $regex: search, $options: 'i' } },
          { citizenName: { $regex: search, $options: 'i' } },
          { landmark: { $regex: search, $options: 'i' } }
        ];
      }
      const complaints = await Complaint.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, count: complaints.length, complaints });
    } else {
      let complaints = inMemoryStore.getComplaints({ status, category });
      if (priority && priority !== 'All') {
        complaints = complaints.filter(c => c.priority === priority);
      }
      if (search) {
        const q = search.toLowerCase();
        complaints = complaints.filter(
          c =>
            c.trackingId.toLowerCase().includes(q) ||
            c.title.toLowerCase().includes(q) ||
            c.citizenName.toLowerCase().includes(q) ||
            c.landmark.toLowerCase().includes(q)
        );
      }
      return res.json({ success: true, count: complaints.length, complaints });
    }
  } catch (error) {
    console.error('[Get Complaints Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Ward Representative updates status & official remark
// @route   PATCH /api/complaints/:id/status
// @access  Private (Ward Representative / Admin)
const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminRemark, assignedDepartment } = req.body;

    const allowedStatuses = ['Submitted', 'Under Review', 'In Progress', 'Completed', 'Rejected'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}`
      });
    }

    const updaterName = req.user ? `${req.user.name} (${req.user.designation || 'Ward Rep'})` : 'Ward Representative Office';

    if (getIsConnected()) {
      const complaint = await Complaint.findOne({
        $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { trackingId: id }]
      });

      if (!complaint) {
        return res.status(404).json({ success: false, message: 'Complaint record not found' });
      }

      complaint.status = status;
      if (adminRemark) complaint.adminRemark = adminRemark;
      if (assignedDepartment) complaint.assignedDepartment = assignedDepartment;
      if (status === 'Completed') complaint.resolvedAt = new Date();

      complaint.statusHistory.push({
        status,
        timestamp: new Date(),
        note: adminRemark || `Status updated to ${status}`,
        updatedBy: updaterName
      });

      await complaint.save();

      return res.json({
        success: true,
        message: `Complaint ${complaint.trackingId} marked as ${status}`,
        complaint
      });
    } else {
      const updated = inMemoryStore.updateComplaint(id, {
        status,
        adminRemark,
        assignedDepartment,
        updatedBy: updaterName
      });

      if (!updated) {
        return res.status(404).json({ success: false, message: 'Complaint record not found' });
      }

      return res.json({
        success: true,
        message: `Complaint ${updated.trackingId} marked as ${status}`,
        complaint: updated
      });
    }
  } catch (error) {
    console.error('[Update Complaint Status Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get aggregate statistics of grievances
// @route   GET /api/complaints/stats
// @access  Public
const getComplaintStats = async (req, res) => {
  try {
    let list = [];
    if (getIsConnected()) {
      list = await Complaint.find({});
    } else {
      list = inMemoryStore.complaints;
    }

    const total = list.length;
    const submitted = list.filter(c => c.status === 'Submitted').length;
    const underReview = list.filter(c => c.status === 'Under Review').length;
    const inProgress = list.filter(c => c.status === 'In Progress').length;
    const completed = list.filter(c => c.status === 'Completed').length;
    const rejected = list.filter(c => c.status === 'Rejected').length;

    const resolutionRate = total > 0 ? Math.round((completed / total) * 100) : 100;

    res.json({
      success: true,
      stats: {
        total,
        submitted,
        underReview,
        inProgress,
        completed,
        rejected,
        resolutionRate
      }
    });
  } catch (error) {
    console.error('[Get Complaint Stats Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createComplaint,
  trackComplaint,
  getAllComplaints,
  updateComplaintStatus,
  getComplaintStats
};
