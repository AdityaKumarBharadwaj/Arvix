import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Phone, Mail, MapPin, ExternalLink, HelpCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-sm mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: About Ward */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-white font-bold">
                14
              </div>
              <div>
                <h3 className="text-white font-bold text-base tracking-tight font-sans">ARVIX PORTAL</h3>
                <p className="text-[11px] text-slate-500">Ward No. 14, Central Zone</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Official hyper-local civic grievance redressal and citizen welfare dissemination portal for Ward No. 14. Designed for rapid municipal service delivery and 100% grievance transparency.
            </p>
            <div className="pt-2 text-xs text-slate-500 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified Municipal Citizen Desk</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-4 font-mono">
              Citizen Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/complaints" className="hover:text-white transition-colors">
                  Lodge Road, Water or School Grievance
                </Link>
              </li>
              <li>
                <Link to="/complaints/track" className="hover:text-white transition-colors">
                  Live Grievance Tracking Timeline
                </Link>
              </li>
              <li>
                <Link to="/schemes" className="hover:text-white transition-colors">
                  Government Schemes & How to Apply
                </Link>
              </li>
              <li>
                <Link to="/hall-booking" className="hover:text-white transition-colors">
                  Community & Vivah Bhavan Calendar
                </Link>
              </li>
              <li>
                <Link to="/medicine-and-ration" className="hover:text-white transition-colors">
                  Free Medicine & Fair Price Ration Shop
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Ward Helplines */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-4 font-mono">
              Emergency & Helplines
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <span>Ward Control Room:</span>
                <span className="font-mono text-white font-bold">1800-200-1414</span>
              </li>
              <li className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <span>Jal Board Emergency:</span>
                <span className="font-mono text-slate-300">011-2874-9000</span>
              </li>
              <li className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <span>Dispensary / Ambulance:</span>
                <span className="font-mono text-slate-300">102 / 108</span>
              </li>
              <li className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                <span>Women Helpline:</span>
                <span className="font-mono text-slate-300">1091</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Electricity Fault Desk:</span>
                <span className="font-mono text-slate-300">1912</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Office Location & Hours */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-4 font-mono">
              Ward Office Address
            </h4>
            <div className="space-y-2 text-xs">
              <p className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <span>
                  Office of the Ward Councilor, Municipal Community Center Complex, Sector 2, Main Market Road.
                </span>
              </p>
              <p className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-mono">ward14@arvix.gov.in</span>
              </p>
              <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-800">
                Citizen Consultation Open Hours: Every Tuesday & Thursday (10:00 AM – 1:00 PM)
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-y-2">
          <p>© {new Date().getFullYear()} ARVIX Ward Citizen Services Portal. All Rights Reserved.</p>
          <div className="flex items-center space-x-4">
            <span className="text-[11px]">Government of India / State Municipal Corporation Initiative</span>
            <Link to="/login" className="hover:text-slate-300">Official Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
