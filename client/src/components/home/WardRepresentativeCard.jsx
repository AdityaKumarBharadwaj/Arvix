import React from 'react';
import { UserCheck, Phone, Mail, Clock, MapPin, CheckCircle2 } from 'lucide-react';

const WardRepresentativeCard = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Profile Avatar / Photo placeholder */}
        <div className="relative shrink-0">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-900 border-2 border-amber-400 text-white flex flex-col items-center justify-center shadow-xs">
            <UserCheck className="w-8 h-8 text-amber-300" />
            <span className="text-[9px] font-bold tracking-widest uppercase text-slate-300">WARD 14</span>
          </div>
          <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" title="On Active Public Duty"></span>
        </div>

        {/* Representative Details */}
        <div className="flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900 font-sans">
              Shri Rajeshwar Verma
            </h3>
            <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
              Ward Councilor / Elected Representative
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            "Serving Ward 14 with prompt grievance redressal, quality public schools, reliable water supply, and complete transparency in local development funds."
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-700">
            <span className="flex items-center font-mono">
              <Phone className="w-3.5 h-3.5 mr-1 text-slate-400" />
              Direct Office: <strong className="ml-1 text-slate-900">+91 98765-43210</strong>
            </span>
            <span className="flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
              Public Sabha: <strong className="ml-1 text-slate-900">Tue & Thu (10 AM – 1 PM)</strong>
            </span>
            <span className="flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
              Office: <span className="ml-1 text-slate-600">Community Center, Sector 2</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WardRepresentativeCard;
