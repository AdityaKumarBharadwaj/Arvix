import React from 'react';
import { UserCheck, Phone, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const WardRepresentativeCard = () => {
  const { language, t } = useLanguage();

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Profile Avatar */}
        <div className="relative shrink-0">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-900 border-2 border-amber-400 text-white flex flex-col items-center justify-center shadow-xs">
            <UserCheck className="w-8 h-8 text-amber-300" />
            <span className="text-[9px] font-bold tracking-widest uppercase text-slate-300 font-mono">
              {language === 'hi' ? 'वार्ड 14' : 'WARD 14'}
            </span>
          </div>
          <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" title="On Active Public Duty"></span>
        </div>

        {/* Representative Details */}
        <div className="flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold text-slate-900 font-sans">
              {t('repName')}
            </h3>
            <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
              {t('repDesignation')}
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed italic">
            {t('repQuote')}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-700">
            <span className="flex items-center font-mono">
              <Phone className="w-3.5 h-3.5 mr-1 text-slate-400" />
              {t('repDirectOffice')} <strong className="ml-1 text-slate-900">+91 98765-43210</strong>
            </span>
            <span className="flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
              {t('repSabhaTimings')} <strong className="ml-1 text-slate-900">{t('repSabhaValue')}</strong>
            </span>
            <span className="flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
              {t('repOfficeLoc')} <span className="ml-1 text-slate-600">{t('repOfficeValue')}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WardRepresentativeCard;
