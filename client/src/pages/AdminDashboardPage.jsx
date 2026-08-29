import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  complaintService,
  hallService,
  announcementService,
  schemeService
} from '../services/api';
import {
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Filter,
  Search,
  Calendar,
  Megaphone,
  PlusCircle,
  Trash2,
  Building,
  Check,
  X,
  FileText,
  UserCheck,
  MessageSquare
} from 'lucide-react';

const AdminDashboardPage = () => {
  const { user, isRepresentative, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('complaints'); // complaints, hall, announcements, addScheme
  const [complaints, setComplaints] = useState([]);
  const [hallBookings, setHallBookings] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters for complaints
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected complaint modal for status update
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [updateStatusVal, setUpdateStatusVal] = useState('Under Review');
  const [adminRemarkVal, setAdminRemarkVal] = useState('');
  const [assignedDeptVal, setAssignedDeptVal] = useState('');
  const [updating, setUpdating] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Announcement Form State
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    category: 'Ward Function',
    urgency: 'Important',
    eventDate: '',
    isPinned: true
  });
  const [postingAnnouncement, setPostingAnnouncement] = useState(false);

  // Scheme Form State
  const [newScheme, setNewScheme] = useState({
    title: '',
    category: 'Healthcare',
    department: 'Department of Health & Family Welfare',
    badge: '100% Free Public Benefit',
    shortDescription: '',
    fullDescription: '',
    benefits: '',
    eligibility: '',
    documentsRequired: '',
    officialPortalUrl: ''
  });
  const [postingScheme, setPostingScheme] = useState(false);

  // Load all admin data
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [cmpRes, hallRes, ancRes, statRes] = await Promise.all([
        complaintService.getAllComplaints(),
        hallService.getAllBookings(),
        announcementService.getAll(),
        complaintService.getStats()
      ]);

      if (cmpRes.success) setComplaints(cmpRes.complaints);
      if (hallRes.success) setHallBookings(hallRes.bookings);
      if (ancRes.success) setAnnouncements(ancRes.announcements);
      if (statRes.success) setStats(statRes.stats);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isRepresentative) {
      navigate('/login');
      return;
    }
    loadDashboardData();
  }, [isRepresentative, navigate]);

  // Handle complaint status update
  const handleUpdateComplaint = async (e) => {
    e.preventDefault();
    if (!selectedComplaint) return;
    setUpdating(true);
    setFeedbackMsg('');

    try {
      const res = await complaintService.updateStatus(selectedComplaint.trackingId || selectedComplaint._id, {
        status: updateStatusVal,
        adminRemark: adminRemarkVal,
        assignedDepartment: assignedDeptVal || selectedComplaint.assignedDepartment
      });

      if (res.success) {
        setFeedbackMsg(`Complaint ${selectedComplaint.trackingId} marked as ${updateStatusVal}`);
        setSelectedComplaint(null);
        setAdminRemarkVal('');
        loadDashboardData();
      }
    } catch (err) {
      setFeedbackMsg(err.message || 'Failed to update complaint.');
    } finally {
      setUpdating(false);
    }
  };

  // Handle hall booking approval or rejection
  const handleHallBookingAction = async (id, status) => {
    const remark = prompt(`Enter official note for marking as ${status}:`, `Status updated to ${status} by Ward Office`);
    if (remark === null) return;

    try {
      await hallService.updateStatus(id, { status, adminRemark: remark });
      loadDashboardData();
    } catch (err) {
      alert(err.message || 'Failed to update booking');
    }
  };

  // Handle create announcement
  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    setPostingAnnouncement(true);
    try {
      const res = await announcementService.create(newAnnouncement);
      if (res.success) {
        alert('Announcement posted to citizen hero marquee successfully!');
        setNewAnnouncement({
          title: '',
          content: '',
          category: 'Ward Function',
          urgency: 'Important',
          eventDate: '',
          isPinned: true
        });
        loadDashboardData();
      }
    } catch (err) {
      alert(err.message || 'Failed to post announcement');
    } finally {
      setPostingAnnouncement(false);
    }
  };

  // Handle delete announcement
  const handleDeleteAnnouncement = async (id) => {
    if (!confirm('Are you sure you want to delete this notice?')) return;
    try {
      await announcementService.delete(id);
      loadDashboardData();
    } catch (err) {
      alert(err.message || 'Failed to delete');
    }
  };

  // Handle create scheme
  const handleCreateScheme = async (e) => {
    e.preventDefault();
    setPostingScheme(true);
    try {
      const payload = {
        ...newScheme,
        benefits: newScheme.benefits.split('\n').filter(Boolean),
        eligibility: newScheme.eligibility.split('\n').filter(Boolean),
        documentsRequired: newScheme.documentsRequired.split('\n').filter(Boolean)
      };
      const res = await schemeService.create(payload);
      if (res.success) {
        alert('Government scheme added to public directory!');
        setNewScheme({
          title: '',
          category: 'Healthcare',
          department: '',
          badge: '100% Free Public Benefit',
          shortDescription: '',
          fullDescription: '',
          benefits: '',
          eligibility: '',
          documentsRequired: '',
          officialPortalUrl: ''
        });
        setActiveTab('complaints');
      }
    } catch (err) {
      alert(err.message || 'Failed to add scheme');
    } finally {
      setPostingScheme(false);
    }
  };

  // Filter complaints
  const filteredComplaints = complaints.filter((c) => {
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;
    const matchesSearch =
      !searchTerm.trim() ||
      c.trackingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.citizenName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.landmark.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesCategory && matchesSearch;
  });

  return (
    <div className="py-8 lg:py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header Card */}
        <div className="bg-slate-900 text-white rounded-lg p-6 border border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span className="text-xs uppercase font-mono font-bold tracking-wider text-slate-300">
                Official Ward Administration Console
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold font-sans">
              Ward Representative Review & Control Desk
            </h1>
            <p className="text-xs text-slate-400">
              Logged in as: <strong className="text-white">{user?.name}</strong> ({user?.designation || 'Ward Councilor'}) • Ward No. {user?.wardNumber || 14}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={logout}
              className="civic-btn-secondary text-xs px-3 py-1.5 bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 hover:text-white"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Metrics Counter Grid */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-xs">
              <div className="text-[11px] font-mono text-slate-500 font-bold uppercase">Total Grievances</div>
              <div className="text-2xl font-extrabold font-mono text-slate-900 mt-1">{stats.total}</div>
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-xs">
              <div className="text-[11px] font-mono text-slate-500 font-bold uppercase">Submitted / New</div>
              <div className="text-2xl font-extrabold font-mono text-slate-700 mt-1">{stats.submitted}</div>
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-xs">
              <div className="text-[11px] font-mono text-amber-700 font-bold uppercase">Under Review</div>
              <div className="text-2xl font-extrabold font-mono text-amber-600 mt-1">{stats.underReview}</div>
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-xs">
              <div className="text-[11px] font-mono text-blue-700 font-bold uppercase">In Progress</div>
              <div className="text-2xl font-extrabold font-mono text-blue-600 mt-1">{stats.inProgress}</div>
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-xs">
              <div className="text-[11px] font-mono text-emerald-700 font-bold uppercase">Resolved</div>
              <div className="text-2xl font-extrabold font-mono text-emerald-600 mt-1">{stats.completed}</div>
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-xs">
              <div className="text-[11px] font-mono text-rose-700 font-bold uppercase">Rejected</div>
              <div className="text-2xl font-extrabold font-mono text-rose-600 mt-1">{stats.rejected}</div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="border-b border-slate-200 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('complaints')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-md transition-colors ${
              activeTab === 'complaints'
                ? 'bg-white border-t-2 border-slate-900 text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📋 Grievances Redressal Desk ({complaints.length})
          </button>

          <button
            onClick={() => setActiveTab('hall')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-md transition-colors ${
              activeTab === 'hall'
                ? 'bg-white border-t-2 border-slate-900 text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🏛️ Marriage Hall Inquiries ({hallBookings.length})
          </button>

          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-md transition-colors ${
              activeTab === 'announcements'
                ? 'bg-white border-t-2 border-slate-900 text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📢 Broadcast Bulletin & Functions ({announcements.length})
          </button>

          <button
            onClick={() => setActiveTab('addScheme')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-md transition-colors ${
              activeTab === 'addScheme'
                ? 'bg-white border-t-2 border-slate-900 text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ➕ Post New Government Scheme
          </button>
        </div>

        {/* ================= TAB 1: GRIEVANCES REDRESSAL ================= */}
        {activeTab === 'complaints' && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="bg-white border border-slate-200 p-4 rounded-lg flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs">
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="civic-input text-xs py-1.5 w-auto"
                >
                  <option value="All">All Statuses</option>
                  <option value="Submitted">Submitted (New)</option>
                  <option value="Under Review">Under Review</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Rejected">Rejected</option>
                </select>

                {/* Category Filter */}
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="civic-input text-xs py-1.5 w-auto"
                >
                  <option value="All">All Categories</option>
                  <option value="Road">Roads</option>
                  <option value="Water">Water Supply</option>
                  <option value="Government School">Govt School</option>
                  <option value="Electricity">Streetlight</option>
                  <option value="Sanitation">Sanitation</option>
                </select>
              </div>

              {/* Search */}
              <div className="w-full md:w-72 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search tracking ID, title, citizen..."
                  className="civic-input pl-9 text-xs py-1.5"
                />
              </div>
            </div>

            {/* Complaints Table */}
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 font-mono text-slate-700 border-b border-slate-200">
                    <tr>
                      <th className="p-3 font-bold">Tracking ID</th>
                      <th className="p-3 font-bold">Category</th>
                      <th className="p-3 font-bold">Subject / Title</th>
                      <th className="p-3 font-bold">Complainant</th>
                      <th className="p-3 font-bold">Priority</th>
                      <th className="p-3 font-bold">Current Status</th>
                      <th className="p-3 font-bold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredComplaints.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-500">
                          No grievances match the selected filters.
                        </td>
                      </tr>
                    ) : (
                      filteredComplaints.map((c) => (
                        <tr key={c._id || c.trackingId} className="hover:bg-slate-50">
                          <td className="p-3 font-mono font-bold text-slate-900">{c.trackingId}</td>
                          <td className="p-3 font-semibold text-slate-700">{c.category}</td>
                          <td className="p-3 max-w-xs truncate font-medium text-slate-900" title={c.title}>
                            {c.title}
                          </td>
                          <td className="p-3 text-slate-600">
                            <div>{c.citizenName}</div>
                            <div className="font-mono text-[10px] text-slate-400">{c.citizenPhone}</div>
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${
                                c.priority === 'Urgent'
                                  ? 'bg-rose-50 text-rose-800 border-rose-200'
                                  : c.priority === 'High'
                                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                                  : 'bg-slate-100 text-slate-700 border-slate-200'
                              }`}
                            >
                              {c.priority}
                            </span>
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                c.status === 'Completed'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : c.status === 'Rejected'
                                  ? 'bg-rose-50 text-rose-800 border-rose-300'
                                  : c.status === 'In Progress'
                                  ? 'bg-blue-50 text-blue-800 border-blue-300'
                                  : c.status === 'Under Review'
                                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                                  : 'bg-slate-100 text-slate-700 border-slate-300'
                              }`}
                            >
                              {c.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => {
                                setSelectedComplaint(c);
                                setUpdateStatusVal(c.status);
                                setAdminRemarkVal(c.adminRemark || '');
                                setAssignedDeptVal(c.assignedDepartment || '');
                              }}
                              className="civic-btn-primary text-[11px] px-3 py-1 font-semibold"
                            >
                              Review & Update
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: MARRIAGE HALL INQUIRIES ================= */}
        {activeTab === 'hall' && (
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900 font-sans">
                Ward 14 Community Vivah Bhavan Booking Requests
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                Total Requests: {hallBookings.length}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200">
                <thead className="bg-slate-100 font-mono text-slate-700">
                  <tr>
                    <th className="p-3 border-b border-slate-200 font-bold">Booking Date</th>
                    <th className="p-3 border-b border-slate-200 font-bold">Event Type</th>
                    <th className="p-3 border-b border-slate-200 font-bold">Applicant Details</th>
                    <th className="p-3 border-b border-slate-200 font-bold">Guests</th>
                    <th className="p-3 border-b border-slate-200 font-bold">Status</th>
                    <th className="p-3 border-b border-slate-200 font-bold text-right">Representative Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {hallBookings.map((b) => (
                    <tr key={b._id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-slate-900">{b.date}</td>
                      <td className="p-3 font-semibold text-slate-700">{b.eventType}</td>
                      <td className="p-3 text-slate-600">
                        <div className="font-bold text-slate-900">{b.applicantName}</div>
                        <div className="text-[11px] font-mono">{b.applicantPhone}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-xs">{b.applicantAddress}</div>
                      </td>
                      <td className="p-3 font-mono font-bold text-slate-800">{b.guestCount}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            b.status === 'Confirmed'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : b.status === 'Rejected'
                              ? 'bg-rose-50 text-rose-800 border-rose-300'
                              : 'bg-amber-50 text-amber-800 border-amber-300'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                        {b.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleHallBookingAction(b._id, 'Confirmed')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold inline-flex items-center space-x-1"
                            >
                              <Check className="w-3 h-3" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => handleHallBookingAction(b._id, 'Rejected')}
                              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-[11px] font-bold inline-flex items-center space-x-1"
                            >
                              <X className="w-3 h-3" />
                              <span>Reject</span>
                            </button>
                          </>
                        )}
                        {b.status !== 'Pending' && (
                          <span className="text-[11px] text-slate-400 italic">Action Completed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 3: BROADCAST BULLETIN & FUNCTIONS ================= */}
        {activeTab === 'announcements' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Create Form */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-bold text-sm text-slate-900 font-sans flex items-center">
                  <Megaphone className="w-4 h-4 mr-1.5 text-amber-500" />
                  Broadcast Ward Function or Emergency Notice
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  This will immediately display on the citizen homepage marquee and notice board.
                </p>
              </div>

              <form onSubmit={handleCreateAnnouncement} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    Announcement Headline *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAnnouncement.title}
                    onChange={(e) =>
                      setNewAnnouncement((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="e.g. Ward Open Sabha & Road Resurfacing Review"
                    className="civic-input"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">Category</label>
                    <select
                      value={newAnnouncement.category}
                      onChange={(e) =>
                        setNewAnnouncement((prev) => ({ ...prev, category: e.target.value }))
                      }
                      className="civic-input"
                    >
                      <option value="Ward Function">Ward Function</option>
                      <option value="Emergency Alert">Emergency Alert</option>
                      <option value="Public Notice">Public Notice</option>
                      <option value="Health Camp">Health Camp</option>
                      <option value="Sanitation Drive">Sanitation Drive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">Urgency</label>
                    <select
                      value={newAnnouncement.urgency}
                      onChange={(e) =>
                        setNewAnnouncement((prev) => ({ ...prev, urgency: e.target.value }))
                      }
                      className="civic-input"
                    >
                      <option value="Normal">Normal</option>
                      <option value="Important">Important</option>
                      <option value="Urgent">Urgent Alert</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    Event Date / Timings (Optional)
                  </label>
                  <input
                    type="text"
                    value={newAnnouncement.eventDate}
                    onChange={(e) =>
                      setNewAnnouncement((prev) => ({ ...prev, eventDate: e.target.value }))
                    }
                    placeholder="e.g. Coming Sunday at 10:30 AM"
                    className="civic-input"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    Complete Notice Details *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={newAnnouncement.content}
                    onChange={(e) =>
                      setNewAnnouncement((prev) => ({ ...prev, content: e.target.value }))
                    }
                    placeholder="Provide full instructions for citizens, venue, helpline..."
                    className="civic-input"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={postingAnnouncement}
                  className="civic-btn-primary w-full text-xs py-2 font-bold"
                >
                  {postingAnnouncement ? 'Broadcasting...' : 'Publish to Citizen Marquee'}
                </button>
              </form>
            </div>

            {/* Right: Existing Announcements List */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 font-sans border-b border-slate-100 pb-3">
                Live Broadcasts on Citizen Portal
              </h3>

              <div className="space-y-3">
                {announcements.map((item) => (
                  <div
                    key={item._id}
                    className="p-3.5 border border-slate-200 rounded-md bg-slate-50 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-[10px] px-2 py-0.5 rounded bg-slate-900 text-white uppercase font-mono">
                          {item.category}
                        </span>
                        {item.eventDate && (
                          <span className="font-mono text-slate-500 font-semibold text-[11px]">
                            [{item.eventDate}]
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                      <p className="text-slate-600 leading-relaxed text-[11px]">{item.content}</p>
                    </div>

                    <button
                      onClick={() => handleDeleteAnnouncement(item._id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded transition-colors shrink-0"
                      title="Remove Announcement"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: ADD NEW SCHEME ================= */}
        {activeTab === 'addScheme' && (
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs max-w-3xl space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 font-sans">
                Post New Public Welfare Scheme to Directory
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Add state or central schemes with full explanation, benefits, and steps to apply.
              </p>
            </div>

            <form onSubmit={handleCreateScheme} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">
                  Scheme Official Name *
                </label>
                <input
                  type="text"
                  required
                  value={newScheme.title}
                  onChange={(e) => setNewScheme((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. Mukhyamantri Yuva Swarojgar Yojana"
                  className="civic-input"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Category *</label>
                  <select
                    value={newScheme.category}
                    onChange={(e) => setNewScheme((prev) => ({ ...prev, category: e.target.value }))}
                    className="civic-input"
                  >
                    <option value="Education">Education</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Housing">Housing</option>
                    <option value="Women & Child">Women & Child</option>
                    <option value="Senior Citizens">Senior Citizens</option>
                    <option value="Food & Ration">Food & Ration</option>
                    <option value="Agriculture & Livelihood">Agriculture & Livelihood</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Department *</label>
                  <input
                    type="text"
                    required
                    value={newScheme.department}
                    onChange={(e) => setNewScheme((prev) => ({ ...prev, department: e.target.value }))}
                    placeholder="e.g. Directorate of Social Welfare"
                    className="civic-input"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Badge Highlight</label>
                  <input
                    type="text"
                    value={newScheme.badge}
                    onChange={(e) => setNewScheme((prev) => ({ ...prev, badge: e.target.value }))}
                    placeholder="e.g. ₹50,000 Direct Subsidy"
                    className="civic-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">
                  Short One-Line Summary *
                </label>
                <input
                  type="text"
                  required
                  value={newScheme.shortDescription}
                  onChange={(e) =>
                    setNewScheme((prev) => ({ ...prev, shortDescription: e.target.value }))
                  }
                  placeholder="Brief summary displayed on scheme card preview"
                  className="civic-input"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">
                  Complete Scheme Explanation & Policy Objectives *
                </label>
                <textarea
                  rows={4}
                  required
                  value={newScheme.fullDescription}
                  onChange={(e) =>
                    setNewScheme((prev) => ({ ...prev, fullDescription: e.target.value }))
                  }
                  placeholder="Detailed background, goals, financial outlay..."
                  className="civic-input"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    Key Benefits (One item per line)
                  </label>
                  <textarea
                    rows={3}
                    value={newScheme.benefits}
                    onChange={(e) => setNewScheme((prev) => ({ ...prev, benefits: e.target.value }))}
                    placeholder="Interest-free loan up to ₹2 Lakh&#10;Free training kit"
                    className="civic-input"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    Eligibility Criteria (One item per line)
                  </label>
                  <textarea
                    rows={3}
                    value={newScheme.eligibility}
                    onChange={(e) => setNewScheme((prev) => ({ ...prev, eligibility: e.target.value }))}
                    placeholder="Age between 18 and 35&#10;Resident of Ward 14"
                    className="civic-input"
                  ></textarea>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={postingScheme}
                  className="civic-btn-primary text-xs px-6 py-2.5 font-bold"
                >
                  {postingScheme ? 'Saving Scheme...' : 'Publish Government Scheme'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Complaint Review & Status Updater Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-lg border border-slate-300 w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {selectedComplaint.trackingId}
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  Representative Grievance Action
                </h3>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateComplaint} className="p-6 space-y-4 text-xs">
              {/* Summary of Complaint */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1">
                <div className="font-bold text-slate-900">{selectedComplaint.title}</div>
                <div className="text-slate-600">{selectedComplaint.description}</div>
                <div className="text-[11px] text-slate-500 pt-1">
                  Landmark: {selectedComplaint.landmark} • Complainant: {selectedComplaint.citizenName} ({selectedComplaint.citizenPhone})
                </div>
              </div>

              {/* Status Selector */}
              <div>
                <label className="block text-[11px] font-bold text-slate-800 uppercase tracking-wider font-mono mb-1">
                  Mark New Status *
                </label>
                <select
                  value={updateStatusVal}
                  onChange={(e) => setUpdateStatusVal(e.target.value)}
                  className="civic-input font-bold"
                >
                  <option value="Under Review">Under Review (Inspection Assigned)</option>
                  <option value="In Progress">In Progress (Work-Order Issued / Contractor on Site)</option>
                  <option value="Completed">Completed (Problem Solved & Verified)</option>
                  <option value="Rejected">Rejected (Out of Ward / Duplicate / Invalid)</option>
                </select>
              </div>

              {/* Assigned Department */}
              <div>
                <label className="block text-[11px] font-bold text-slate-800 uppercase tracking-wider font-mono mb-1">
                  Assigned Public Works Department
                </label>
                <input
                  type="text"
                  value={assignedDeptVal}
                  onChange={(e) => setAssignedDeptVal(e.target.value)}
                  placeholder="e.g. Municipal Roads & Highway Dept"
                  className="civic-input"
                />
              </div>

              {/* Official Action Note / Remark */}
              <div>
                <label className="block text-[11px] font-bold text-slate-800 uppercase tracking-wider font-mono mb-1">
                  Official Ward Remark / Action Taken Note *
                </label>
                <textarea
                  rows={3}
                  required
                  value={adminRemarkVal}
                  onChange={(e) => setAdminRemarkVal(e.target.value)}
                  placeholder="Explain the action taken, contractor assigned, or why it was rejected..."
                  className="civic-input"
                ></textarea>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedComplaint(null)}
                  className="civic-btn-secondary text-xs px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="civic-btn-primary text-xs px-5 py-2 font-bold"
                >
                  {updating ? 'Updating...' : 'Save & Publish Status Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
