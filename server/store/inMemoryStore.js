// In-memory data store providing resilient fallback when local MongoDB is not running
const bcrypt = require('bcryptjs');

class InMemoryStore {
  constructor() {
    this.users = [];
    this.complaints = [];
    this.schemes = [];
    this.hallBookings = [];
    this.announcements = [];
    this.medicineSchedule = null;
    this.rationSchedule = null;
    this.initDefaultAdmin();
  }

  async initDefaultAdmin() {
    const salt = await bcrypt.genSalt(10);
    const adminHashed = await bcrypt.hash('WardRep@2026', salt);
    const citizenHashed = await bcrypt.hash('Citizen@2026', salt);

    // Default Ward Representative
    this.users.push({
      _id: 'rep_admin_001',
      name: 'Shri Rajeshwar Verma',
      email: 'representative@arvix.gov.in',
      phone: '9876543210',
      aadhaarNumber: '999988887777',
      maskedAadhaar: 'XXXX-XXXX-7777',
      password: adminHashed,
      role: 'representative',
      designation: 'Ward Councilor / Representative',
      wardNumber: 14,
      isAadhaarVerified: true,
      createdAt: new Date('2026-08-01')
    });

    // Default Verified Ward Resident Citizen
    this.users.push({
      _id: 'cit_resident_001',
      name: 'Ramesh Kumar Sharma',
      email: 'ramesh.sharma@example.com',
      phone: '9810145678',
      aadhaarNumber: '543287651042',
      maskedAadhaar: 'XXXX-XXXX-1042',
      wardAddress: 'House No. 42, Gali No. 3, Sector 2, Ward 14',
      wardSector: 'Sector 2',
      password: citizenHashed,
      role: 'citizen',
      designation: 'Verified Ward 14 Resident',
      wardNumber: 14,
      isAadhaarVerified: true,
      createdAt: new Date('2026-08-05')
    });
  }

  // Find user by Email, Phone, or Aadhaar
  findUserByIdentifier(identifier) {
    if (!identifier) return null;
    const clean = identifier.toString().trim().toLowerCase().replace(/[^a-z0-9@.]/g, '');
    const cleanNumbers = identifier.toString().replace(/[^0-9]/g, '');

    return this.users.find(u => {
      const emailMatch = u.email && u.email.toLowerCase() === clean;
      const phoneMatch = u.phone && u.phone === cleanNumbers;
      const aadhaarMatch = u.aadhaarNumber && (u.aadhaarNumber === cleanNumbers || u.aadhaarNumber.replace(/[^0-9]/g, '') === cleanNumbers);
      return emailMatch || phoneMatch || aadhaarMatch;
    });
  }

  // Users
  findUserByEmail(email) {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id) {
    const user = this.users.find(u => u._id.toString() === id.toString());
    if (user) {
      const { password, ...safeUser } = user;
      return safeUser;
    }
    return null;
  }

  async createUser(userData) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    const newUser = {
      _id: 'usr_' + Date.now(),
      ...userData,
      password: hashedPassword,
      createdAt: new Date()
    };
    this.users.push(newUser);
    const { password, ...safeUser } = newUser;
    return safeUser;
  }

  // Complaints
  getComplaints(filter = {}) {
    let list = [...this.complaints];
    if (filter.status && filter.status !== 'All') {
      list = list.filter(c => c.status === filter.status);
    }
    if (filter.category && filter.category !== 'All') {
      list = list.filter(c => c.category === filter.category);
    }
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  getComplaintByTrackingId(trackingId) {
    return this.complaints.find(c => c.trackingId.toUpperCase() === trackingId.toUpperCase());
  }

  getComplaintById(id) {
    return this.complaints.find(c => c._id.toString() === id.toString() || c.trackingId === id);
  }

  createComplaint(data) {
    const newComplaint = {
      _id: 'cmp_' + Date.now(),
      statusHistory: [
        {
          status: 'Submitted',
          timestamp: new Date(),
          note: 'Grievance received and registered on Ward Portal.',
          updatedBy: 'Citizen Self-Service'
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data
    };
    this.complaints.unshift(newComplaint);
    return newComplaint;
  }

  updateComplaint(id, updateData) {
    const index = this.complaints.findIndex(c => c._id.toString() === id.toString() || c.trackingId === id);
    if (index === -1) return null;

    const current = this.complaints[index];
    const newHistory = [...(current.statusHistory || [])];

    if (updateData.status && updateData.status !== current.status) {
      newHistory.push({
        status: updateData.status,
        timestamp: new Date(),
        note: updateData.adminRemark || `Status moved to ${updateData.status}`,
        updatedBy: updateData.updatedBy || 'Ward Representative'
      });
    }

    const updated = {
      ...current,
      ...updateData,
      statusHistory: newHistory,
      updatedAt: new Date(),
      resolvedAt: updateData.status === 'Completed' ? new Date() : current.resolvedAt
    };

    this.complaints[index] = updated;
    return updated;
  }

  // Schemes
  getSchemes(filter = {}) {
    let list = [...this.schemes];
    if (filter.category && filter.category !== 'All') {
      list = list.filter(s => s.category.toLowerCase() === filter.category.toLowerCase());
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(s => s.title.toLowerCase().includes(q) || s.shortDescription.toLowerCase().includes(q));
    }
    return list;
  }

  getSchemeById(id) {
    return this.schemes.find(s => s._id.toString() === id.toString() || s.slug === id);
  }

  createScheme(data) {
    const scheme = {
      _id: 'sch_' + Date.now(),
      createdAt: new Date(),
      ...data
    };
    this.schemes.unshift(scheme);
    return scheme;
  }

  // Hall Bookings
  getHallBookings() {
    return this.hallBookings.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  createHallBooking(data) {
    const booking = {
      _id: 'hb_' + Date.now(),
      status: 'Pending',
      createdAt: new Date(),
      ...data
    };
    this.hallBookings.push(booking);
    return booking;
  }

  updateHallBooking(id, status, adminRemark) {
    const item = this.hallBookings.find(b => b._id.toString() === id.toString());
    if (!item) return null;
    item.status = status;
    if (adminRemark) item.adminRemark = adminRemark;
    return item;
  }

  // Announcements
  getAnnouncements() {
    return this.announcements.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  createAnnouncement(data) {
    const item = {
      _id: 'anc_' + Date.now(),
      createdAt: new Date(),
      ...data
    };
    this.announcements.unshift(item);
    return item;
  }

  deleteAnnouncement(id) {
    const initialLen = this.announcements.length;
    this.announcements = this.announcements.filter(a => a._id.toString() !== id.toString());
    return this.announcements.length !== initialLen;
  }

  // Medicine & Ration
  getMedicineSchedule() {
    return this.medicineSchedule;
  }

  setMedicineSchedule(data) {
    this.medicineSchedule = data;
    return this.medicineSchedule;
  }

  getRationSchedule() {
    return this.rationSchedule;
  }

  setRationSchedule(data) {
    this.rationSchedule = data;
    return this.rationSchedule;
  }
}

const inMemoryStore = new InMemoryStore();

module.exports = { inMemoryStore };
