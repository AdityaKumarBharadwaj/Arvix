import React from 'react';
import { Phone, Clock, AlertCircle, ShieldCheck, Languages } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const TopUtilityBar = () => {
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <div className="bg-slate-950 text-slate-200 text-xs border-b border-slate-800">
      {/* Subtle National Tricolor Top Accent Strip */}
      <div className="h-1 w-full flex">
        <div className="h-full w-1/3 bg-[#FF9933]"></div>
        <div className="h-full w-1/3 bg-white"></div>
        <div className="h-full w-1/3 bg-[#138808]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-y-1.5">
        {/* Left: Ward Jurisdiction */}
        <div className="flex items-center space-x-3 text-slate-300">
          <span className="inline-flex items-center font-semibold text-white tracking-wide">
            <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
            {t('wardTitle')}
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline-flex items-center text-slate-300">
            <Clock className="w-3 h-3 mr-1 text-slate-400" />
            {t('officeHours')}
          </span>
        </div>

        {/* Right: Helplines & Language Switcher */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="flex items-center space-x-1.5">
            <Phone className="w-3 h-3 text-amber-400" />
            <span className="text-slate-400 hidden xs:inline">{t('tollFree')}</span>
            <a href="tel:18002001414" className="font-mono font-bold text-white hover:underline">
              1800-200-1414
            </a>
          </div>

          <span className="text-slate-700">|</span>

          {/* Hindi / English Switcher */}
          <button
            onClick={toggleLanguage}
            className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 text-[11px] font-bold transition-colors cursor-pointer"
            title="भाषा बदलें / Change Language"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'English' : 'हिंदी में देखें'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopUtilityBar;
