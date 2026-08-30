import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  Search,
  ArrowRight,
  ShieldCheck,
  Wrench,
  CalendarCheck,
  Pill,
  ShoppingBag,
  FileText
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const HeroSection = () => {
  const [quickTrackId, setQuickTrackId] = useState('');
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleQuickTrack = (e) => {
    e.preventDefault();
    if (quickTrackId.trim()) {
      navigate(`/complaints/track?id=${encodeURIComponent(quickTrackId.trim().toUpperCase())}`);
    }
  };

  return (
    <div className="bg-slate-900 text-white border-b border-slate-800 relative overflow-hidden">
      {/* Subtle institutional grid lines background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Heading & Quick Search */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="font-semibold text-slate-100">{t('heroBadge')}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">{t('heroSubBadge')}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-sans text-white leading-tight">
              {t('heroHeading')}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              {t('heroDescription')}
            </p>

            {/* Quick Track Input Bar */}
            <form
              onSubmit={handleQuickTrack}
              className="bg-white p-2 rounded-lg shadow-lg max-w-xl flex flex-col sm:flex-row items-stretch gap-2 border border-slate-200"
            >
              <div className="relative flex-1 flex items-center">
                <Search className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
                <input
                  type="text"
                  value={quickTrackId}
                  onChange={(e) => setQuickTrackId(e.target.value)}
                  placeholder={t('trackPlaceholder')}
                  className="w-full pl-2 pr-3 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none font-mono"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs sm:text-sm font-semibold tracking-wide flex items-center justify-center space-x-1.5 transition-colors shrink-0"
              >
                <span>{t('btnTrackStatus')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Micro Tags */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-400">
              <span className="flex items-center text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                {t('slaBadge')}
              </span>
              <span className="flex items-center text-slate-300">
                <Wrench className="w-3.5 h-3.5 mr-1 text-amber-400" />
                {t('servicesBadge')}
              </span>
            </div>
          </div>

          {/* Right Column: Key Service Action Pillars */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Card 1: File Complaint */}
            <Link
              to="/complaints"
              className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 p-4 rounded-lg flex flex-col justify-between group transition-all hover:border-amber-400/50 hover:translate-y-[-2px]"
            >
              <div>
                <div className="w-9 h-9 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-sm">{t('cardGrievanceTitle')}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-snug">
                  {t('cardGrievanceDesc')}
                </p>
              </div>
              <span className="text-xs font-semibold text-amber-400 inline-flex items-center mt-3 pt-2 border-t border-slate-700/60">
                {t('cardGrievanceBtn')} <ArrowRight className="w-3 h-3 ml-1" />
              </span>
            </Link>

            {/* Card 2: Government Schemes */}
            <Link
              to="/schemes"
              className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 p-4 rounded-lg flex flex-col justify-between group transition-all hover:border-amber-400/50 hover:translate-y-[-2px]"
            >
              <div>
                <div className="w-9 h-9 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-sm">{t('cardSchemesTitle')}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-snug">
                  {t('cardSchemesDesc')}
                </p>
              </div>
              <span className="text-xs font-semibold text-amber-400 inline-flex items-center mt-3 pt-2 border-t border-slate-700/60">
                {t('cardSchemesBtn')} <ArrowRight className="w-3 h-3 ml-1" />
              </span>
            </Link>

            {/* Card 3: Marriage Hall Booking */}
            <Link
              to="/hall-booking"
              className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 p-4 rounded-lg flex flex-col justify-between group transition-all hover:border-amber-400/50 hover:translate-y-[-2px]"
            >
              <div>
                <div className="w-9 h-9 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-sm">{t('cardHallTitle')}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-snug">
                  {t('cardHallDesc')}
                </p>
              </div>
              <span className="text-xs font-semibold text-amber-400 inline-flex items-center mt-3 pt-2 border-t border-slate-700/60">
                {t('cardHallBtn')} <ArrowRight className="w-3 h-3 ml-1" />
              </span>
            </Link>

            {/* Card 4: Free Medicine & Ration */}
            <Link
              to="/medicine-and-ration"
              className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 p-4 rounded-lg flex flex-col justify-between group transition-all hover:border-amber-400/50 hover:translate-y-[-2px]"
            >
              <div>
                <div className="w-9 h-9 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-sm">{t('cardMedRationTitle')}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-snug">
                  {t('cardMedRationDesc')}
                </p>
              </div>
              <span className="text-xs font-semibold text-amber-400 inline-flex items-center mt-3 pt-2 border-t border-slate-700/60">
                {t('cardMedRationBtn')} <ArrowRight className="w-3 h-3 ml-1" />
              </span>
            </Link>
          </div>
        </div>

        {/* Civic Metrics Strip */}
        <div className="mt-12 pt-6 border-t border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4 text-center md:text-left">
          <div className="border-r border-slate-800/80 pr-4">
            <div className="font-mono text-2xl font-extrabold text-emerald-400">96.4%</div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">{t('statResolutionRate')}</div>
          </div>
          <div className="border-r border-slate-800/80 pr-4">
            <div className="font-mono text-2xl font-extrabold text-white">1,420+</div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">{t('statRedressed')}</div>
          </div>
          <div className="border-r border-slate-800/80 pr-4">
            <div className="font-mono text-2xl font-extrabold text-amber-400">35+</div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">{t('statActiveSchemes')}</div>
          </div>
          <div>
            <div className="font-mono text-2xl font-extrabold text-blue-400">100% Free</div>
            <div className="text-xs text-slate-400 font-medium mt-0.5">{t('statFreeBenefit')}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
