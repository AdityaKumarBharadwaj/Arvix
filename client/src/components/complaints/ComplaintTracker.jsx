import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  MapPin,
  Building,
  ShieldAlert
} from 'lucide-react';
import { complaintService } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

const ComplaintTracker = () => {
  const [searchParams] = useSearchParams();
  const [trackingId, setTrackingId] = useState('');
  const [loading, setLoading] = useState(false);
  const [complaint, setComplaint] = useState(null);
  const [error, setError] = useState('');
  const { language, t } = useLanguage();

  const executeTrack = async (idToSearch) => {
    if (!idToSearch) return;
    setLoading(true);
    setError('');
    setComplaint(null);

    try {
      const res = await complaintService.trackComplaint(idToSearch);
      if (res.success && res.complaint) {
        setComplaint(res.complaint);
      } else {
        setError(language === 'hi' ? 'इस संदर्भ संख्या के लिए कोई शिकायत नहीं मिली।' : 'No record found for this tracking ID.');
      }
    } catch (err) {
      setError(err.message || (language === 'hi' ? 'इस संदर्भ संख्या के लिए कोई शिकायत नहीं मिली।' : 'No grievance record found with this reference number.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const idFromQuery = searchParams.get('id');
    if (idFromQuery) {
      setTrackingId(idFromQuery);
      executeTrack(idFromQuery);
    }
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (trackingId.trim()) {
      executeTrack(trackingId.trim());
    }
  };

  const getStatusStepIndex = (status) => {
    if (status === 'Submitted') return 0;
    if (status === 'Under Review') return 1;
    if (status === 'In Progress') return 2;
    if (status === 'Completed') return 3;
    if (status === 'Rejected') return -1;
    return 0;
  };

  const stages = [
    {
      title: language === 'hi' ? 'प्राप्त (दर्ज)' : 'Submitted',
      desc: language === 'hi' ? 'पोर्टल पर पंजीकृत' : 'Registered on Portal'
    },
    {
      title: language === 'hi' ? 'समीक्षाधीन' : 'Under Review',
      desc: language === 'hi' ? 'वार्ड अधिकारी द्वारा जांच' : 'Ward Officer Review'
    },
    {
      title: language === 'hi' ? 'प्रगति पर' : 'In Progress',
      desc: language === 'hi' ? 'कार्य-आदेश जारी' : 'Work-Order Dispatched'
    },
    {
      title: language === 'hi' ? 'निस्तारित' : 'Completed',
      desc: language === 'hi' ? 'समस्या का समाधान पूर्ण' : 'Resolved & Closed'
    },
  ];

  const currentStep = complaint ? getStatusStepIndex(complaint.status) : 0;
  const isRejected = complaint?.status === 'Rejected';

  return (
    <div className="space-y-6">
      {/* Search Input Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 font-sans mb-1">
          {language === 'hi' ? 'शिकायत की स्थिति ट्रैक करें' : 'Track Grievance Status'}
        </h2>
        <p className="text-xs text-slate-500 mb-4">
          {language === 'hi'
            ? 'अपनी ट्रैकिंग आईडी (जैसे ARV-2024-1042) या पंजीकृत 10-अंकों का मोबाइल नंबर दर्ज करें।'
            : 'Enter your Tracking Reference ID (e.g. ARV-2024-1042) or 10-digit registered mobile number.'}
        </p>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 max-w-xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="e.g. ARV-2024-1042 or 9810145678"
              className="civic-input pl-9 font-mono text-sm"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="civic-btn-primary text-xs px-5 py-2.5 font-semibold shrink-0"
          >
            {loading
              ? (language === 'hi' ? 'खोज जारी है...' : 'Searching Record...')
              : (language === 'hi' ? 'स्थिति जांचें' : 'Track Grievance')}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-md text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Complaint Result Detail & Stepper */}
      {complaint && (
        <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs space-y-8">
          {/* Top Overview Bar */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-slate-200 pb-5 gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-600 px-2 py-0.5 bg-slate-100 rounded border border-slate-300">
                  {complaint.trackingId}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                  {complaint.category}
                </span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded border ${
                    complaint.priority === 'Urgent'
                      ? 'bg-rose-50 text-rose-800 border-rose-200'
                      : complaint.priority === 'High'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-slate-100 text-slate-700 border-slate-300'
                  }`}
                >
                  {language === 'hi' ? 'प्राथमिकता:' : 'Priority:'} {complaint.priority}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-2 font-sans">
                {complaint.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1 flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                {complaint.landmark} ({language === 'hi' ? 'वार्ड संख्या' : 'Ward'} {complaint.wardNumber || 14})
              </p>
            </div>

            {/* Current Status Pill */}
            <div className="shrink-0">
              <span
                className={`inline-flex items-center px-3 py-1.5 rounded-md text-xs font-bold border ${
                  complaint.status === 'Completed'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : complaint.status === 'Rejected'
                    ? 'bg-rose-50 text-rose-800 border-rose-300'
                    : complaint.status === 'In Progress'
                    ? 'bg-blue-50 text-blue-800 border-blue-300'
                    : complaint.status === 'Under Review'
                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                    : 'bg-slate-100 text-slate-800 border-slate-300'
                }`}
              >
                {complaint.status === 'Completed' && <CheckCircle className="w-4 h-4 mr-1.5 text-emerald-600" />}
                {complaint.status === 'Rejected' && <XCircle className="w-4 h-4 mr-1.5 text-rose-600" />}
                {complaint.status === 'In Progress' && <Clock className="w-4 h-4 mr-1.5 text-blue-600" />}
                {complaint.status === 'Under Review' && <Clock className="w-4 h-4 mr-1.5 text-amber-600" />}
                {complaint.status === 'Submitted' && <Clock className="w-4 h-4 mr-1.5 text-slate-600" />}
                {language === 'hi' ? 'वर्तमान स्थिति:' : 'STATUS:'} {complaint.status.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Stepper Timeline (if not rejected) */}
          {!isRejected ? (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                {language === 'hi' ? 'निवारण प्रगति मील के पत्थर' : 'Redressal Progress Milestones'}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                {stages.map((stage, idx) => {
                  const isDone = currentStep >= idx;
                  const isCurrent = currentStep === idx;
                  return (
                    <div
                      key={stage.title}
                      className={`p-3 rounded-md border transition-all ${
                        isCurrent
                          ? 'bg-slate-900 text-white border-slate-950 shadow-xs'
                          : isDone
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                          : 'bg-slate-50 text-slate-400 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center space-x-1.5 text-xs font-bold">
                        {isDone ? (
                          <CheckCircle className={`w-3.5 h-3.5 ${isCurrent ? 'text-amber-400' : 'text-emerald-600'}`} />
                        ) : (
                          <span className="w-3.5 h-3.5 rounded-full border border-slate-400 inline-block text-[10px] text-center leading-3">
                            {idx + 1}
                          </span>
                        )}
                        <span>{stage.title}</span>
                      </div>
                      <div
                        className={`text-[10px] mt-1 ${
                          isCurrent ? 'text-slate-300' : isDone ? 'text-emerald-700' : 'text-slate-400'
                        }`}
                      >
                        {stage.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-md space-y-1">
              <div className="flex items-center space-x-2 text-rose-800 font-bold text-sm">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>{language === 'hi' ? 'वार्ड प्रशासन द्वारा शिकायत अस्वीकृत' : 'Grievance Rejected by Ward Authority'}</span>
              </div>
              <p className="text-xs text-rose-700">
                {language === 'hi' ? 'कारण / टिप्पणी:' : 'Reason / Remark:'} {complaint.adminRemark || 'Outside municipal ward boundary.'}
              </p>
            </div>
          )}

          {/* Grievance Description & Meta */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 border border-slate-200 p-4 rounded-lg text-xs">
            <div className="space-y-2">
              <div className="font-bold text-slate-800 uppercase tracking-wider font-mono text-[11px]">
                {language === 'hi' ? 'नागरिक द्वारा दर्ज शिकायत सारांश' : 'Citizen Submission Summary'}
              </div>
              <p className="text-slate-700 leading-relaxed">{complaint.description}</p>
              <div className="pt-2 text-[11px] text-slate-500 space-y-1">
                <div>
                  <strong className="text-slate-700">{language === 'hi' ? 'पंजीकरण दिनांक:' : 'Lodge Date:'}</strong>{' '}
                  {new Date(complaint.createdAt).toLocaleString(language === 'hi' ? 'hi-IN' : 'en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                </div>
                <div>
                  <strong className="text-slate-700">{language === 'hi' ? 'शिकायतकर्ता:' : 'Complainant:'}</strong> {complaint.citizenName} ({complaint.citizenPhone})
                </div>
              </div>
            </div>

            <div className="space-y-2 border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-4">
              <div className="font-bold text-slate-800 uppercase tracking-wider font-mono text-[11px]">
                {language === 'hi' ? 'प्रशासनिक आवंटन एवं टिप्पणी' : 'Administrative Assignment'}
              </div>
              <div className="space-y-1.5 text-slate-700">
                <div className="flex items-center space-x-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    <strong>{language === 'hi' ? 'विभाग:' : 'Department:'}</strong> {complaint.assignedDepartment || 'Ward Public Works'}
                  </span>
                </div>
                {complaint.adminRemark && (
                  <div className="p-2.5 bg-white border border-slate-200 rounded text-slate-800">
                    <span className="font-bold text-slate-900 block mb-0.5">
                      {language === 'hi' ? 'वार्ड कार्यालय आधिकारिक टिप्पणी:' : 'Official Ward Note:'}
                    </span>
                    {complaint.adminRemark}
                  </div>
                )}
                {complaint.resolvedAt && (
                  <div className="text-emerald-700 font-semibold">
                    ✓ {language === 'hi' ? 'समस्या का समाधान दिनांक' : 'Resolved on'} {new Date(complaint.resolvedAt).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN')}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Official Audit History Log */}
          {complaint.statusHistory && complaint.statusHistory.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                {language === 'hi' ? 'आधिकारिक निवारण ऑडिट ट्रेल (इतिहास)' : 'Official Redressal Audit Trail'}
              </h4>
              <div className="border border-slate-200 rounded-md divide-y divide-slate-100 overflow-hidden">
                {complaint.statusHistory.map((entry, index) => (
                  <div key={index} className="p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900">{entry.status}</span>
                        <span className="text-[10px] text-slate-500">
                          {language === 'hi' ? 'द्वारा' : 'by'} {entry.updatedBy}
                        </span>
                      </div>
                      <p className="text-slate-600">{entry.note}</p>
                    </div>
                    <span className="font-mono text-[11px] text-slate-400 shrink-0">
                      {new Date(entry.timestamp).toLocaleString(language === 'hi' ? 'hi-IN' : 'en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ComplaintTracker;
