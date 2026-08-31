import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { authService } from '../services/api';
import {
  User,
  CreditCard,
  Phone,
  MapPin,
  ShieldCheck,
  PlusCircle,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  Calendar,
  LogOut,
  Building
} from 'lucide-react';

const CitizenDashboardPage = () => {
  const { user, isCitizen, logout } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('complaints'); // complaints, bookings
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadProfile = async () => {
      try {
        setLoading(true);
        const res = await authService.getMe();
        if (res.success) {
          setProfileData(res);
        }
      } catch (err) {
        console.error('Error loading resident profile:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user, navigate]);

  if (!user) return null;

  const myComplaints = profileData?.myComplaints || [];
  const myBookings = profileData?.myBookings || [];

  return (
    <div className="py-8 lg:py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Resident Verified Profile Header */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-slate-900 border-2 border-emerald-400 text-white flex items-center justify-center shrink-0">
                <User className="w-8 h-8 text-emerald-300" />
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-bold text-slate-900 font-sans">
                    {user.name}
                  </h1>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    {language === 'hi' ? 'आधार सत्यापित वार्ड निवासी' : 'Aadhaar Verified Resident'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                  <span className="flex items-center font-mono">
                    <CreditCard className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    {user.maskedAadhaar || 'XXXX-XXXX-1042'}
                  </span>
                  <span className="flex items-center font-mono">
                    <Phone className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    +91 {user.phone}
                  </span>
                  <span className="flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    {user.wardAddress || 'Ward 14, Central Zone'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action & Logout */}
            <div className="flex items-center space-x-2">
              <Link
                to="/complaints"
                className="civic-btn-primary text-xs px-4 py-2 font-bold"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'नई शिकायत दर्ज करें' : 'Lodge New Grievance'}</span>
              </Link>
              <button
                onClick={logout}
                className="civic-btn-secondary text-xs px-3 py-2 text-rose-600 hover:bg-rose-50"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'लॉगआउट' : 'Logout'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-slate-200 flex space-x-2">
          <button
            onClick={() => setActiveTab('complaints')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-md transition-colors ${
              activeTab === 'complaints'
                ? 'bg-white border-t-2 border-slate-900 text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📋 {language === 'hi' ? 'मेरी दर्ज शिकायतें' : 'My Registered Grievances'} ({myComplaints.length})
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-md transition-colors ${
              activeTab === 'bookings'
                ? 'bg-white border-t-2 border-slate-900 text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🏛️ {language === 'hi' ? 'मेरे विवाह भवन आरक्षण' : 'My Hall Bookings'} ({myBookings.length})
          </button>
        </div>

        {/* Tab 1: My Complaints */}
        {activeTab === 'complaints' && (
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900 font-sans">
                {language === 'hi' ? 'वार्ड संख्या 14 में आपके द्वारा दर्ज शिकायतें' : 'Grievances Submitted by You in Ward 14'}
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                {language === 'hi' ? 'कुल संख्या:' : 'Total:'} {myComplaints.length}
              </span>
            </div>

            {myComplaints.length === 0 ? (
              <div className="text-center py-10 space-y-3">
                <Clock className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-500">
                  {language === 'hi'
                    ? 'आपने अभी तक कोई शिकायत दर्ज नहीं की है।'
                    : 'You have not submitted any complaints yet.'}
                </p>
                <Link
                  to="/complaints"
                  className="civic-btn-primary text-xs px-4 py-2 inline-flex items-center space-x-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'पहली शिकायत दर्ज करें' : 'Lodge a Complaint'}</span>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {myComplaints.map((c) => (
                  <div key={c._id || c.trackingId} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 p-2 rounded">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-700 px-2 py-0.5 bg-slate-100 rounded border border-slate-300">
                          {c.trackingId}
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                          {c.category}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {new Date(c.createdAt).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN')}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900">{c.title}</h4>
                      <p className="text-xs text-slate-600 max-w-2xl line-clamp-2">{c.description}</p>
                      <div className="text-[11px] text-slate-500 flex items-center">
                        <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                        {c.landmark}
                      </div>

                      {c.adminRemark && (
                        <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-950">
                          <strong>{language === 'hi' ? 'पार्षद टिप्पणी: ' : 'Official Note: '}</strong>
                          {c.adminRemark}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:items-end gap-2 shrink-0">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-bold border ${
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
                        {c.status === 'Completed' && <CheckCircle className="w-3.5 h-3.5 mr-1 text-emerald-600" />}
                        {c.status === 'Rejected' && <XCircle className="w-3.5 h-3.5 mr-1 text-rose-600" />}
                        {c.status}
                      </span>

                      <Link
                        to={`/complaints/track?id=${c.trackingId}`}
                        className="text-xs font-bold text-slate-900 hover:text-amber-600 inline-flex items-center"
                      >
                        <span>{language === 'hi' ? 'लाइव प्रगति देखें' : 'View Timeline'}</span>
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: My Hall Bookings */}
        {activeTab === 'bookings' && (
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900 font-sans">
                {language === 'hi' ? 'सामुदायिक विवाह भवन आरक्षण अनुरोध' : 'Vivah Bhavan Booking Inquiries'}
              </h3>
              <Link to="/hall-booking" className="text-xs font-bold text-slate-900 hover:underline">
                + {language === 'hi' ? 'नया स्लॉट आरक्षित करें' : 'Reserve New Date'}
              </Link>
            </div>

            {myBookings.length === 0 ? (
              <div className="text-center py-10 space-y-3">
                <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-500">
                  {language === 'hi'
                    ? 'आपने अभी तक कोई विवाह भवन आरक्षण अनुरोध नहीं भेजा है।'
                    : 'You have not submitted any hall reservation requests yet.'}
                </p>
                <Link
                  to="/hall-booking"
                  className="civic-btn-primary text-xs px-4 py-2 inline-flex items-center space-x-1.5"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'कैलेंडर देखें' : 'View Hall Calendar'}</span>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200">
                  <thead className="bg-slate-100 font-mono text-slate-700">
                    <tr>
                      <th className="p-3 border-b border-slate-200 font-bold">{language === 'hi' ? 'आरक्षण दिनांक' : 'Booking Date'}</th>
                      <th className="p-3 border-b border-slate-200 font-bold">{language === 'hi' ? 'समारोह का प्रकार' : 'Event Type'}</th>
                      <th className="p-3 border-b border-slate-200 font-bold">{language === 'hi' ? 'अतिथि संख्या' : 'Guest Count'}</th>
                      <th className="p-3 border-b border-slate-200 font-bold">{language === 'hi' ? 'स्थिति' : 'Status'}</th>
                      <th className="p-3 border-b border-slate-200 font-bold">{language === 'hi' ? 'पार्षद कार्यालय टिप्पणी' : 'Office Remark'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {myBookings.map((b) => (
                      <tr key={b._id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-slate-900">{b.date}</td>
                        <td className="p-3 font-semibold text-slate-700">{b.eventType}</td>
                        <td className="p-3 font-mono">{b.guestCount}</td>
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
                        <td className="p-3 text-slate-600 text-[11px]">{b.adminRemark || 'Under verification'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CitizenDashboardPage;
