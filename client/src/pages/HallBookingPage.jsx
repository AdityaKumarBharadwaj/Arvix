import React, { useState, useEffect } from 'react';
import { hallService } from '../../services/api';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Building2,
  FileText,
  Phone,
  X
} from 'lucide-react';

const HallBookingPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookedDatesMap, setBookedDatesMap] = useState({});
  const [hallDetails, setHallDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [selectedDateStr, setSelectedDateStr] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingFormData, setBookingFormData] = useState({
    applicantName: '',
    applicantPhone: '',
    applicantEmail: '',
    applicantAddress: '',
    eventType: 'Marriage',
    guestCount: 400,
    idProofType: 'Aadhaar Card',
    idProofNumber: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchCalendar = async () => {
    try {
      setLoading(true);
      const res = await hallService.getCalendar();
      if (res.success) {
        setBookedDatesMap(res.bookedDates || {});
        setHallDetails(res.hallDetails);
      }
    } catch (err) {
      console.error('Error fetching hall calendar:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendar();
  }, []);

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const formatDateKey = (d) => {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  const handleDayClick = (dayNum, isPast, bookingInfo) => {
    if (isPast) return;
    if (bookingInfo && bookingInfo.status === 'Confirmed') return;

    const dateKey = formatDateKey(dayNum);
    setSelectedDateStr(dateKey);
    setSubmitMessage(null);
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    try {
      const payload = {
        ...bookingFormData,
        date: selectedDateStr,
        guestCount: Number(bookingFormData.guestCount)
      };

      const res = await hallService.bookHall(payload);
      if (res.success) {
        setSubmitMessage(res.message);
        fetchCalendar(); // refresh dates
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to submit booking request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-8 lg:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="border-b border-slate-200 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                Municipal Community Facilities
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans mt-0.5">
                Ward 14 Community & Vivah (Marriage) Bhavan
              </h1>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Check free dates and confirmed bookings on the live calendar. Ward residents receive subsidized hall hire rates for marriages, receptions, and community ceremonies.
              </p>
            </div>

            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="px-3 py-1.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold">
                Resident Rate: ₹12,000 / Day
              </span>
            </div>
          </div>
        </div>

        {/* Main Grid: Calendar on Left, Amenities & Rules on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Calendar Section (8 cols) */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-5">
            {/* Calendar Controls */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="w-5 h-5 text-slate-900" />
                <h2 className="text-lg font-bold text-slate-900 font-sans">
                  {monthNames[month]} {year}
                </h2>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={prevMonth}
                  className="p-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-100"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-2.5 py-1 text-xs font-medium rounded border border-slate-300 hover:bg-slate-50"
                >
                  Current Month
                </button>
                <button
                  onClick={nextMonth}
                  className="p-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-100"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Calendar Legend */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium bg-slate-50 border border-slate-200 p-2.5 rounded-md">
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-sm bg-emerald-100 border border-emerald-300"></span>
                <span className="text-slate-700">Free / Open Date (Click to Reserve)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-sm bg-rose-100 border border-rose-300"></span>
                <span className="text-slate-700">Booked (Confirmed)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-sm bg-amber-100 border border-amber-300"></span>
                <span className="text-slate-700">Under Review</span>
              </div>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-1 text-center font-mono text-xs font-bold text-slate-500 py-1 border-b border-slate-100">
              <span>SUN</span>
              <span>MON</span>
              <span>TUE</span>
              <span>WED</span>
              <span>THU</span>
              <span>FRI</span>
              <span>SAT</span>
            </div>

            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7 gap-1.5">
              {/* Blank cells for offset */}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`blank-${i}`} className="h-20 sm:h-24 bg-slate-50/50 rounded-md"></div>
              ))}

              {/* Month Days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const dateKey = formatDateKey(dayNum);
                const cellDate = new Date(year, month, dayNum);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const isPast = cellDate < today;

                const bookingInfo = bookedDatesMap[dateKey];
                const isBooked = bookingInfo && bookingInfo.status === 'Confirmed';
                const isPending = bookingInfo && bookingInfo.status === 'Pending';

                let cellClass = 'border-slate-200 bg-emerald-50/60 hover:bg-emerald-100/70 border-emerald-300 cursor-pointer';
                if (isPast) {
                  cellClass = 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed';
                } else if (isBooked) {
                  cellClass = 'bg-rose-50 border-rose-300 cursor-not-allowed';
                } else if (isPending) {
                  cellClass = 'bg-amber-50 border-amber-300 cursor-pointer';
                }

                return (
                  <div
                    key={dateKey}
                    onClick={() => handleDayClick(dayNum, isPast, bookingInfo)}
                    className={`h-20 sm:h-24 p-1.5 rounded-md border flex flex-col justify-between transition-all ${cellClass}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-mono font-bold ${isPast ? 'text-slate-400' : 'text-slate-900'}`}>
                        {dayNum}
                      </span>
                      {cellDate.getTime() === today.getTime() && (
                        <span className="text-[9px] font-bold px-1 rounded bg-slate-900 text-white font-mono">
                          TODAY
                        </span>
                      )}
                    </div>

                    <div className="text-[10px] leading-tight">
                      {isPast ? (
                        <span className="text-slate-400">Past</span>
                      ) : isBooked ? (
                        <div className="font-bold text-rose-800 bg-rose-100 px-1 py-0.5 rounded truncate">
                          {bookingInfo.eventType || 'Booked'}
                        </div>
                      ) : isPending ? (
                        <div className="font-semibold text-amber-800 bg-amber-100 px-1 py-0.5 rounded truncate">
                          Inquiry Underway
                        </div>
                      ) : (
                        <div className="font-semibold text-emerald-800 bg-emerald-100/80 px-1 py-0.5 rounded text-center">
                          FREE
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] text-slate-500 pt-2 text-center">
              💡 Click on any green <strong className="text-emerald-700">FREE</strong> date cell to open the slot reservation request form.
            </p>
          </div>

          {/* Right Column: Amenities, Rules & Tariff (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Hall Amenities Card */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <Building2 className="w-5 h-5 text-slate-800" />
                <h3 className="font-bold text-sm text-slate-900 font-sans">
                  Facility Specifications
                </h3>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Main Auditorium:</span>
                  <strong className="text-slate-900">850 Floating Guests</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Dining Banquet:</span>
                  <strong className="text-slate-900">350 Seating Guests</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Air Conditioning:</span>
                  <strong className="text-emerald-700">Central HVAC Plant</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Power Backup:</span>
                  <strong className="text-slate-900">100% DG + Solar Gen</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Parking Yard:</span>
                  <strong className="text-slate-900">120 Cars + 250 Bikes</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span>Green Rooms:</span>
                  <strong className="text-slate-900">2 Deluxe AC Suites</strong>
                </div>
              </div>
            </div>

            {/* Tariff & Booking Policy */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider font-mono text-slate-700 flex items-center">
                <ShieldCheck className="w-4 h-4 mr-1 text-slate-800" />
                Tariff & Booking Policy
              </h3>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-slate-800">
                  <div className="font-bold text-slate-900">Ward 14 Resident Subsidized Hire:</div>
                  <div className="font-mono text-sm font-extrabold text-emerald-700">₹12,000 / Day (24 Hrs)</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Includes cleaning, electricity allowance & security.</div>
                </div>

                <div className="text-[11px] text-slate-500 space-y-1 pt-1">
                  <p>• Refundable Security Deposit: ₹5,000.</p>
                  <p>• Ward 14 residency verification (Aadhaar / Voter ID) mandatory.</p>
                  <p>• Music and loudspeakers permitted until 10:00 PM per city noise regulations.</p>
                </div>
              </div>
            </div>

            {/* Ward Office Contact */}
            <div className="bg-slate-900 text-slate-200 rounded-lg p-4 text-xs space-y-1.5 border border-slate-800">
              <div className="font-bold text-white flex items-center space-x-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Hall Booking Caretaker Desk:</span>
              </div>
              <p className="font-mono text-slate-300">Shri Anil Kumar (Supervisor): +91 98112-90901</p>
              <p className="text-[10px] text-slate-400">Desk timings: Mon–Sat 9:30 AM – 5:00 PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Inquiry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-lg border border-slate-300 w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-emerald-500 text-slate-950">
                  Selected Date: {selectedDateStr}
                </span>
                <h3 className="text-base font-bold text-white mt-1 font-sans">
                  Reserve Ward 14 Community Vivah Bhavan
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            {submitMessage ? (
              <div className="p-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  Booking Request Submitted
                </h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                  {submitMessage}
                </p>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="civic-btn-primary text-xs px-5 py-2"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="p-6 space-y-4 text-xs">
                {errorMessage && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 rounded flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      Applicant Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={bookingFormData.applicantName}
                      onChange={(e) =>
                        setBookingFormData((prev) => ({ ...prev, applicantName: e.target.value }))
                      }
                      className="civic-input"
                      placeholder="e.g. Suresh Sharma"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      Contact Mobile *
                    </label>
                    <input
                      type="tel"
                      required
                      value={bookingFormData.applicantPhone}
                      onChange={(e) =>
                        setBookingFormData((prev) => ({ ...prev, applicantPhone: e.target.value }))
                      }
                      className="civic-input font-mono"
                      placeholder="10-digit phone number"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      Function / Event Type *
                    </label>
                    <select
                      value={bookingFormData.eventType}
                      onChange={(e) =>
                        setBookingFormData((prev) => ({ ...prev, eventType: e.target.value }))
                      }
                      className="civic-input"
                    >
                      <option value="Marriage">Marriage (Vivah)</option>
                      <option value="Reception">Wedding Reception</option>
                      <option value="Engagement">Engagement (Sagai)</option>
                      <option value="Birthday / Anniversary">Birthday / Anniversary</option>
                      <option value="Community Meeting">Community / RWA Sabha</option>
                      <option value="Other">Other Community Function</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      Expected Guest Count *
                    </label>
                    <input
                      type="number"
                      min={10}
                      max={1000}
                      required
                      value={bookingFormData.guestCount}
                      onChange={(e) =>
                        setBookingFormData((prev) => ({ ...prev, guestCount: e.target.value }))
                      }
                      className="civic-input font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">
                    Ward 14 Residential Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingFormData.applicantAddress}
                    onChange={(e) =>
                      setBookingFormData((prev) => ({ ...prev, applicantAddress: e.target.value }))
                    }
                    className="civic-input"
                    placeholder="House/Plot number, street, Ward 14"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      Resident ID Proof Type *
                    </label>
                    <select
                      value={bookingFormData.idProofType}
                      onChange={(e) =>
                        setBookingFormData((prev) => ({ ...prev, idProofType: e.target.value }))
                      }
                      className="civic-input"
                    >
                      <option value="Aadhaar Card">Aadhaar Card</option>
                      <option value="Voter ID">Voter ID Card</option>
                      <option value="Ration Card">Ration Card</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      ID Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={bookingFormData.idProofNumber}
                      onChange={(e) =>
                        setBookingFormData((prev) => ({ ...prev, idProofNumber: e.target.value }))
                      }
                      className="civic-input font-mono"
                      placeholder="e.g. XXXX-XXXX-9821"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="civic-btn-secondary text-xs px-4 py-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="civic-btn-primary text-xs px-5 py-2 font-bold"
                  >
                    {submitting ? 'Submitting...' : 'Confirm Reservation Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HallBookingPage;
