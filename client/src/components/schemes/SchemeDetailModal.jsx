import React from 'react';
import {
  X,
  CheckCircle2,
  FileText,
  Building,
  ExternalLink,
  MapPin,
  ListOrdered,
  FileCheck2,
  Users
} from 'lucide-react';

const SchemeDetailModal = ({ scheme, onClose }) => {
  if (!scheme) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-lg border border-slate-300 w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-start justify-between border-b border-slate-800">
          <div className="space-y-1.5 pr-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {scheme.category}
              </span>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500 text-slate-950">
                {scheme.badge}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold font-sans leading-tight">
              {scheme.title}
            </h2>
            <div className="text-xs text-slate-400 flex items-center">
              <Building className="w-3.5 h-3.5 mr-1 text-slate-400" />
              <span>{scheme.department}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 text-xs sm:text-sm">
          {/* Section 1: Detailed Explanation */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono border-b border-slate-200 pb-1 flex items-center">
              <FileText className="w-4 h-4 mr-1.5 text-slate-700" />
              Complete Scheme Explanation & Objectives
            </h3>
            <p className="text-slate-700 leading-relaxed text-xs">
              {scheme.fullDescription}
            </p>
          </div>

          {/* Section 2: Key Benefits */}
          {scheme.benefits && scheme.benefits.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono border-b border-slate-200 pb-1 flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600" />
                Key Benefits & Entitlements
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {scheme.benefits.map((b, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-emerald-600 font-bold mr-2">✓</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Section 3: Eligibility Criteria */}
          {scheme.eligibility && scheme.eligibility.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono border-b border-slate-200 pb-1 flex items-center">
                <Users className="w-4 h-4 mr-1.5 text-blue-600" />
                Eligibility Criteria Checklist
              </h3>
              <div className="bg-slate-50 border border-slate-200 rounded-md p-3 space-y-1.5">
                {scheme.eligibility.map((el, idx) => (
                  <div key={idx} className="flex items-start text-xs text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-1.5 mr-2 shrink-0"></span>
                    <span>{el}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 4: Documents Required */}
          {scheme.documentsRequired && scheme.documentsRequired.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono border-b border-slate-200 pb-1 flex items-center">
                <FileCheck2 className="w-4 h-4 mr-1.5 text-amber-600" />
                Mandatory Documentation Required
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {scheme.documentsRequired.map((doc, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded bg-white border border-slate-200 text-xs text-slate-700 flex items-center space-x-2"
                  >
                    <span className="font-mono text-[10px] font-bold text-slate-400">0{idx + 1}.</span>
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 5: Step-by-Step "How to Apply" Guide */}
          {scheme.applicationSteps && scheme.applicationSteps.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono border-b border-slate-200 pb-1 flex items-center">
                <ListOrdered className="w-4 h-4 mr-1.5 text-purple-600" />
                Step-by-Step Application Guide
              </h3>
              <div className="space-y-2.5">
                {scheme.applicationSteps.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="flex items-start space-x-3 p-3 bg-slate-50 border border-slate-200 rounded-md"
                  >
                    <div className="w-6 h-6 rounded bg-slate-900 text-white font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {step.stepNumber}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{step.stepTitle}</div>
                      <p className="text-xs text-slate-600 mt-0.5">{step.instructions}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 6: Offline Helpdesk Location */}
          <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-md text-xs text-amber-950 flex items-start space-x-2">
            <MapPin className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold">Ward Offline Facilitation Counter:</strong>
              <span>{scheme.offlineLocation || 'Ward Helpdesk Counter No. 3, Ward Office, Mon-Fri 10 AM - 4 PM'}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-500">
            For personal assistance, visit the Ward Councilor Helpdesk.
          </span>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="civic-btn-secondary text-xs px-4 py-2"
            >
              Close
            </button>

            {scheme.officialPortalUrl && (
              <a
                href={scheme.officialPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="civic-btn-primary text-xs px-4 py-2"
              >
                <span>Official Govt Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchemeDetailModal;
