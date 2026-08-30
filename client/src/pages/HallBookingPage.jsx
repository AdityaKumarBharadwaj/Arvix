import React, { useState, useEffect } from 'react';
import { hallService } from '../services/api';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Building2,
  Phone,
  X
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const HallBookingPage = () => {
  const { language, t } = useLanguage();
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

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNamesEn = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const monthNamesHi = [
    'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
    'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
  ];

  const monthNames = language === 'hi' ? monthNamesHi : monthNamesEn;

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
        fetchCalendar();
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
                {language === 'hi' ? 'नगर निगम सामुदायिक सुविधाएं' : 'Municipal Community Facilities'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans mt-0.5">
                {language === 'hi' ? 'वार्ड 14 सामुदायिक एवं विवाह भवन' : 'Ward 14 Community & Vivah (Marriage) Bhavan'}
              </h1>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                {language === 'hi'
                  ? 'लाइव कैलेंडर पर रिक्त तिथियां एवं पूर्व-आरक्षित तिथियां देखें। वार्ड निवासियों को विवाह, रिसेप्शन व उत्सवों हेतु रियायती दर पर भवन उपलब्ध है।'
                  : 'Check free dates and confirmed bookings on the live calendar. Ward residents receive subsidized hall hire rates for marriages, receptions, and community ceremonies.'}
              </p>
            </div>

            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="px-3 py-1.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold">
                {language === 'hi' ? 'निवासी रियायती दर: ₹12,000 / दिन' : 'Resident Rate: ₹12,000 / Day'}
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
                  {language === 'hi' ? 'वर्तमान माह' : 'Current Month'}
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
                <span className="text-slate-700">
                  {language === 'hi' ? 'रिक्त तिथि (आरक्षण हेतु क्लिक करें)' : 'Free / Open Date (Click to Reserve)'}
                </span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-sm bg-rose-100 border border-rose-300"></span>
                <span className="text-slate-700">
                  {language === 'hi' ? 'आरक्षित (बुक)' : 'Booked (Confirmed)'}
                </span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-3 rounded-sm bg-amber-100 border border-amber-300"></span>
                <span className="text-slate-700">
                  {language === 'hi' ? 'प्रक्रियाधीन' : 'Under Review'}
                </span>
              </div>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-1 text-center font-mono text-xs font-bold text-slate-500 py-1 border-b border-slate-100">
              <span>{language === 'hi' ? 'रवि' : 'SUN'}</span>
              <span>{language === 'hi' ? 'सोम' : 'MON'}</span>
              <span>{language === 'hi' ? 'मंगल' : 'TUE'}</span>
              <span>{language === 'hi' ? 'बुध' : 'WED'}</span>
              <span>{language === 'hi' ? 'गुरु' : 'THU'}</span>
              <span>{language === 'hi' ? 'शुक्र' : 'FRI'}</span>
              <span>{language === 'hi' ? 'शनि' : 'SAT'}</span>
            </div>

            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7 gap-1.5">
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`blank-${i}`} className="h-20 sm:h-24 bg-slate-50/50 rounded-md"></div>
              ))}

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
                          {language === 'hi' ? 'आज' : 'TODAY'}
                        </span>
                      )}
                    </div>

                    <div className="text-[10px] leading-tight">
                      {isPast ? (
                        <span className="text-slate-400">{language === 'hi' ? 'व्यतीत' : 'Past'}</span>
                      ) : isBooked ? (
                        <div className="font-bold text-rose-800 bg-rose-100 px-1 py-0.5 rounded truncate">
                          {bookingInfo.eventType || (language === 'hi' ? 'आरक्षित' : 'Booked')}
                        </div>
                      ) : isPending ? (
                        <div className="font-semibold text-amber-800 bg-amber-100 px-1 py-0.5 rounded truncate">
                          {language === 'hi' ? 'समीक्षाधीन' : 'Inquiry'}
                        </div>
                      ) : (
                        <div className="font-semibold text-emerald-800 bg-emerald-100/80 px-1 py-0.5 rounded text-center">
                          {language === 'hi' ? 'रिक्त' : 'FREE'}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] text-slate-500 pt-2 text-center">
              💡 {language === 'hi'
                ? 'किसी भी हरे रंग की '
                : 'Click on any green '}
              <strong className="text-emerald-700">{language === 'hi' ? 'रिक्त तिथि' : 'FREE date'}</strong>
              {language === 'hi'
                ? ' पर क्लिक करके आरक्षण फॉर्म भरें।'
                : ' cell to open the slot reservation request form.'}
            </p>
          </div>

          {/* Right Column: Amenities, Rules & Tariff */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <Building2 className="w-5 h-5 text-slate-800" />
                <h3 className="font-bold text-sm text-slate-900 font-sans">
                  {language === 'hi' ? 'भवन की विशेषताएं एवं सुविधाएं' : 'Facility Specifications'}
                </h3>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>{language === 'hi' ? 'मुख्य वातानुकूलित सभागार:' : 'Main Auditorium:'}</span>
                  <strong className="text-slate-900">850 {language === 'hi' ? 'अतिथि' : 'Guests'}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>{language === 'hi' ? 'भोजन कक्ष (डाइनिंग हॉल):' : 'Dining Banquet:'}</span>
                  <strong className="text-slate-900">350 {language === 'hi' ? 'सीट' : 'Seating'}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>{language === 'hi' ? 'एयर कंडीशनिंग:' : 'Air Conditioning:'}</span>
                  <strong className="text-emerald-700">Central HVAC Plant</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>{language === 'hi' ? 'बिजली बैकअप:' : 'Power Backup:'}</span>
                  <strong className="text-slate-900">100% DG + Solar Gen</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>{language === 'hi' ? 'पार्किंग क्षमता:' : 'Parking Yard:'}</span>
                  <strong className="text-slate-900">120 {language === 'hi' ? 'कार' : 'Cars'} + 250 {language === 'hi' ? 'बाइक' : 'Bikes'}</strong>
                </div>
                <div className="flex justify-between py-1">
                  <span>{language === 'hi' ? 'वर-वधू ग्रीन रूम:' : 'Green Rooms:'}</span>
                  <strong className="text-slate-900">2 Deluxe AC Suites</strong>
                </div>
              </div>
            </div>

            {/* Tariff & Booking Policy */}
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider font-mono text-slate-700 flex items-center">
                <ShieldCheck className="w-4 h-4 mr-1 text-slate-800" />
                {language === 'hi' ? 'शुल्क एवं आरक्षण नियम' : 'Tariff & Booking Policy'}
              </h3>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-slate-800">
                  <div className="font-bold text-slate-900">
                    {language === 'hi' ? 'वार्ड निवासी रियायती किराया:' : 'Ward 14 Resident Subsidized Hire:'}
                  </div>
                  <div className="font-mono text-sm font-extrabold text-emerald-700">
                    ₹12,000 / {language === 'hi' ? 'दिन (24 घंटे)' : 'Day (24 Hrs)'}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {language === 'hi' ? 'सफाई, बिजली व सुरक्षा गार्ड शुल्क सम्मिलित।' : 'Includes cleaning, electricity allowance & security.'}
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 space-y-1 pt-1">
                  <p>• {language === 'hi' ? 'सुरक्षा धरोहर राशि: ₹5,000 (वापसी योग्य)।' : 'Refundable Security Deposit: ₹5,000.'}</p>
                  <p>• {language === 'hi' ? 'वार्ड 14 का निवास प्रमाण (आधार / वोटर कार्ड) अनिवार्य।' : 'Ward 14 residency verification mandatory.'}</p>
                  <p>• {language === 'hi' ? 'ध्वनि विस्तारक यंत्र रात्रि 10:00 बजे तक ही मान्य।' : 'Loudspeakers permitted until 10:00 PM.'}</p>
                </div>
              </div>
            </div>

            {/* Caretaker Contact */}
            <div className="bg-slate-900 text-slate-200 rounded-lg p-4 text-xs space-y-1.5 border border-slate-800">
              <div className="font-bold text-white flex items-center space-x-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>{language === 'hi' ? 'विवाह भवन व्यवस्थापक डेस्क:' : 'Hall Booking Caretaker Desk:'}</span>
              </div>
              <p className="font-mono text-slate-300">Shri Anil Kumar: +91 98112-90901</p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-lg border border-slate-300 w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-emerald-500 text-slate-950">
                  {language === 'hi' ? 'चयनित तिथि:' : 'Selected Date:'} {selectedDateStr}
                </span>
                <h3 className="text-base font-bold text-white mt-1 font-sans">
                  {language === 'hi' ? 'विवाह भवन आरक्षण आवेदन' : 'Reserve Ward 14 Community Vivah Bhavan'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitMessage ? (
              <div className="p-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900">
                  {language === 'hi' ? 'आरक्षण अनुरोध प्राप्त हुआ' : 'Booking Request Submitted'}
                </h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                  {submitMessage}
                </p>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="civic-btn-primary text-xs px-5 py-2"
                >
                  {language === 'hi' ? 'खिड़की बंद करें' : 'Close Window'}
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
                      {language === 'hi' ? 'आवेदक का पूरा नाम *' : 'Applicant Full Name *'}
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
                      {language === 'hi' ? 'मोबाइल नंबर *' : 'Contact Mobile *'}
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
                      {language === 'hi' ? 'समारोह / कार्यक्रम का प्रकार *' : 'Function / Event Type *'}
                    </label>
                    <select
                      value={bookingFormData.eventType}
                      onChange={(e) =>
                        setBookingFormData((prev) => ({ ...prev, eventType: e.target.value }))
                      }
                      className="civic-input"
                    >
                      <option value="Marriage">{language === 'hi' ? 'विवाह (शादी)' : 'Marriage'}</option>
                      <option value="Reception">{language === 'hi' ? 'रिसेप्शन' : 'Reception'}</option>
                      <option value="Engagement">{language === 'hi' ? 'सगाई / रिंग सेरेमनी' : 'Engagement'}</option>
                      <option value="Birthday / Anniversary">{language === 'hi' ? 'जन्मदिन / वर्षगांठ' : 'Birthday / Anniversary'}</option>
                      <option value="Community Meeting">{language === 'hi' ? 'सामुदायिक / आरडब्ल्यूए सभा' : 'Community / RWA Sabha'}</option>
                      <option value="Other">{language === 'hi' ? 'अन्य सामाजिक समारोह' : 'Other'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      {language === 'hi' ? 'अनुमानित अतिथियों की संख्या *' : 'Expected Guest Count *'}
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
                    {language === 'hi' ? 'वार्ड संख्या 14 का निवास पता *' : 'Ward 14 Residential Address *'}
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
                      {language === 'hi' ? 'पहचान प्रमाण प्रकार *' : 'Resident ID Proof Type *'}
                    </label>
                    <select
                      value={bookingFormData.idProofType}
                      onChange={(e) =>
                        setBookingFormData((prev) => ({ ...prev, idProofType: e.target.value }))
                      }
                      className="civic-input"
                    >
                      <option value="Aadhaar Card">{language === 'hi' ? 'आधार कार्ड' : 'Aadhaar Card'}</option>
                      <option value="Voter ID">{language === 'hi' ? 'मतदाता पहचान पत्र (Voter ID)' : 'Voter ID'}</option>
                      <option value="Ration Card">{language === 'hi' ? 'राशन कार्ड' : 'Ration Card'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">
                      {language === 'hi' ? 'आईडी क्रमांक *' : 'ID Number *'}
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
                    {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="civic-btn-primary text-xs px-5 py-2 font-bold"
                  >
                    {submitting
                      ? (language === 'hi' ? 'जमा हो रहा है...' : 'Submitting...')
                      : (language === 'hi' ? 'आरक्षण अनुरोध सबमिट करें' : 'Confirm Reservation Request')}
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
