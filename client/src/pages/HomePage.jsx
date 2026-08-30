import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/home/HeroSection';
import AnnouncementTicker from '../components/home/AnnouncementTicker';
import WardRepresentativeCard from '../components/home/WardRepresentativeCard';
import {
  Wrench,
  Droplet,
  School,
  Zap,
  Trash2,
  ArrowRight,
  Calendar,
  Pill,
  ShoppingBag,
  Clock
} from 'lucide-react';
import { schemeService, hallService, scheduleService } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const HomePage = () => {
  const [featuredSchemes, setFeaturedSchemes] = useState([]);
  const [hallData, setHallData] = useState(null);
  const [medicineSchedule, setMedicineSchedule] = useState(null);
  const [rationSchedule, setRationSchedule] = useState(null);
  const { language, t } = useLanguage();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [schRes, hallRes, medRes, ratRes] = await Promise.allSettled([
          schemeService.getAll(),
          hallService.getCalendar(),
          scheduleService.getMedicineSchedule(),
          scheduleService.getRationSchedule()
        ]);

        if (schRes.status === 'fulfilled' && schRes.value.success) {
          setFeaturedSchemes(schRes.value.schemes.slice(0, 3));
        }
        if (hallRes.status === 'fulfilled' && hallRes.value.success) {
          setHallData(hallRes.value);
        }
        if (medRes.status === 'fulfilled' && medRes.value.success) {
          setMedicineSchedule(medRes.value.medicineSchedule);
        }
        if (ratRes.status === 'fulfilled' && ratRes.value.success) {
          setRationSchedule(ratRes.value.rationSchedule);
        }
      } catch (e) {
        console.warn('Home preview data load warning:', e.message);
      }
    };
    loadData();
  }, []);

  return (
    <div className="space-y-10 pb-16">
      {/* 1. Bulletin / Urgent Notice Marquee */}
      <AnnouncementTicker />

      {/* 2. Institutional Hero Section */}
      <HeroSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* 3. Ward Representative Official Desk Card */}
        <WardRepresentativeCard />

        {/* 4. Grievance Categories Spotlight */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-200 pb-3 gap-2">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                {language === 'hi' ? 'नागरिक सेवा क्षेत्र' : 'Municipal Grievance System'}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-sans">
                {language === 'hi' ? 'वार्ड 14 में किन समस्याओं की शिकायत कर सकते हैं?' : 'What Can You Report in Ward 14?'}
              </h2>
            </div>
            <Link
              to="/complaints"
              className="text-xs font-semibold text-slate-800 hover:text-slate-950 inline-flex items-center space-x-1"
            >
              <span>{t('cardGrievanceBtn')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {/* Category: Roads */}
            <div className="bg-white border border-slate-200 p-4 rounded-lg flex flex-col justify-between hover:border-slate-400 transition-colors">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Wrench className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">{t('catRoad')}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {t('catRoadDesc')}
                </p>
              </div>
              <Link
                to="/complaints?cat=Road"
                className="mt-4 text-[11px] font-bold text-slate-700 hover:text-slate-950 inline-flex items-center"
              >
                {language === 'hi' ? 'सड़क शिकायत दर्ज करें →' : 'Report Road Issue →'}
              </Link>
            </div>

            {/* Category: Water */}
            <div className="bg-white border border-slate-200 p-4 rounded-lg flex flex-col justify-between hover:border-slate-400 transition-colors">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Droplet className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">{t('catWater')}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {t('catWaterDesc')}
                </p>
              </div>
              <Link
                to="/complaints?cat=Water"
                className="mt-4 text-[11px] font-bold text-slate-700 hover:text-slate-950 inline-flex items-center"
              >
                {language === 'hi' ? 'पानी की शिकायत दर्ज करें →' : 'Report Water Issue →'}
              </Link>
            </div>

            {/* Category: Schools */}
            <div className="bg-white border border-slate-200 p-4 rounded-lg flex flex-col justify-between hover:border-slate-400 transition-colors">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <School className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">{t('catSchool')}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {t('catSchoolDesc')}
                </p>
              </div>
              <Link
                to="/complaints?cat=School"
                className="mt-4 text-[11px] font-bold text-slate-700 hover:text-slate-950 inline-flex items-center"
              >
                {language === 'hi' ? 'स्कूल शिकायत दर्ज करें →' : 'Report School Issue →'}
              </Link>
            </div>

            {/* Category: Electricity */}
            <div className="bg-white border border-slate-200 p-4 rounded-lg flex flex-col justify-between hover:border-slate-400 transition-colors">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded bg-yellow-50 text-yellow-700 flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">{t('catElectric')}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {t('catElectricDesc')}
                </p>
              </div>
              <Link
                to="/complaints?cat=Electricity"
                className="mt-4 text-[11px] font-bold text-slate-700 hover:text-slate-950 inline-flex items-center"
              >
                {language === 'hi' ? 'बिजली शिकायत दर्ज करें →' : 'Report Electric Issue →'}
              </Link>
            </div>

            {/* Category: Sanitation */}
            <div className="bg-white border border-slate-200 p-4 rounded-lg flex flex-col justify-between hover:border-slate-400 transition-colors">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded bg-purple-50 text-purple-700 flex items-center justify-center">
                  <Trash2 className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">{t('catSanitation')}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {t('catSanitationDesc')}
                </p>
              </div>
              <Link
                to="/complaints?cat=Sanitation"
                className="mt-4 text-[11px] font-bold text-slate-700 hover:text-slate-950 inline-flex items-center"
              >
                {language === 'hi' ? 'कूड़ा शिकायत दर्ज करें →' : 'Report Sanitation Issue →'}
              </Link>
            </div>
          </div>
        </section>

        {/* 5. Split Section: Community Hall Availability & Free Medicine/Ration Snapshot */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Community Vivah Bhavan Feature Card */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-lg p-6 flex flex-col justify-between shadow-xs">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {language === 'hi' ? 'लाइव स्लॉट उपलब्धता' : 'Live Slot Availability'}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {language === 'hi' ? 'क्षमता: 850 अतिथि' : 'Capacity: 850 Guests'}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {t('hallTitle')}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {t('hallSubtitle')}
                </p>
              </div>

              {/* Booking Status Legend Preview */}
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-md flex items-center justify-around text-xs font-medium">
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                  <span className="text-slate-700">{t('freeDates')}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
                  <span className="text-slate-700">{t('bookedDates')}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-amber-400 inline-block"></span>
                  <span className="text-slate-700">{t('underReviewDates')}</span>
                </div>
              </div>

              <div className="text-xs text-slate-600 space-y-1">
                <p className="font-semibold text-slate-800">
                  {language === 'hi' ? 'प्रमुख सुविधाएं शामिल:' : 'Key Amenities Included:'}
                </p>
                <p className="text-[11px] text-slate-500">
                  {language === 'hi'
                    ? '✓ सेंट्रल एसी हॉल • सुसज्जित रसोई • आरओ पेयजल • कवर्ड पार्किंग • 24 घंटे बिजली बैकअप'
                    : '✓ Central AC Main Auditorium • Commercial Kitchen • RO Plant • Covered Parking • 24/7 Power Backup'}
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500 font-medium">
                  {language === 'hi' ? 'रियायती दर:' : 'Subsidized Tariff:'}
                </div>
                <div className="text-sm font-bold text-slate-900 font-mono">₹12,000 / {language === 'hi' ? 'दिन' : 'Day'}</div>
              </div>
              <Link
                to="/hall-booking"
                className="civic-btn-primary text-xs px-4 py-2"
              >
                <span>{language === 'hi' ? 'माहवार कैलेंडर देखें' : 'Check Month Calendar'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right: Free Medicine & Ration Schedule Teaser */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-lg p-6 flex flex-col justify-between shadow-xs">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {language === 'hi' ? 'मुफ्त नागरिक अधिकार' : 'Free Citizen Entitlements'}
                </span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  100% {language === 'hi' ? 'मुफ्त' : 'Free'}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {language === 'hi'
                    ? 'निःशुल्क दवा औषधालय एवं सरकारी राशन वितरण'
                    : 'Free Medicine Dispensary & Fair Price Ration Shop'}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {language === 'hi'
                    ? 'प्राथमिक स्वास्थ्य केंद्र के खुलने का समय, डॉक्टर की उपलब्धता, उपलब्ध दवाइयों की सूची और उचित दर राशन दुकान की तारीखें देखें।'
                    : 'Verify operating hours, doctor on duty, available in-stock generic medicines, and Fair Price Shop (FPS) foodgrain distribution token dates.'}
                </p>
              </div>

              {/* Two Column Mini Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-md space-y-1.5">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-900">
                    <Pill className="w-3.5 h-3.5 text-rose-500" />
                    <span>{language === 'hi' ? 'शहरी स्वास्थ्य केंद्र' : 'Urban PHC Dispensary'}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-mono">
                    {language === 'hi' ? 'सोम–शनि: 8:30 AM – 1:30 PM' : 'Mon–Sat: 8:30 AM – 1:30 PM'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {language === 'hi' ? '10+ जरूरी दवाएं उपलब्ध, फ्री बीपी व शुगर जांच।' : '10+ essential medicines in stock, free sugar & BP checks.'}
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3 rounded-md space-y-1.5">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-900">
                    <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />
                    <span>{language === 'hi' ? 'उचित दर राशन डिपो' : 'Fair Price Ration Depot'}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-mono">
                    {language === 'hi' ? '1 से 20 तारीख: 8 AM–12:30 PM' : '1st–20th: 8 AM–12:30 PM & 4–7:30 PM'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {language === 'hi' ? 'अंत्योदय एवं बीपीएल कार्डधारकों को मुफ्त अनाज।' : 'Free grain quota for AAY & PHH cardholders under PMGKAY.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {language === 'hi' ? 'डीलर संपर्क व दवा स्टॉक साप्ताहिक अपडेट' : 'Dealer Contact & Stock Inventory updated weekly'}
              </span>
              <Link
                to="/medicine-and-ration"
                className="civic-btn-secondary text-xs px-4 py-2"
              >
                <span>{language === 'hi' ? 'पूरी समय सारणी देखें' : 'View Full Timetable'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* 6. Government Schemes Section Spotlight */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-200 pb-3 gap-2">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                {language === 'hi' ? 'सार्वजनिक कल्याण पोर्टल' : 'Public Welfare Portal'}
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-sans">
                {language === 'hi' ? 'प्रमुख सरकारी योजनाएं' : 'Popular Government Schemes'}
              </h2>
            </div>
            <Link
              to="/schemes"
              className="text-xs font-semibold text-slate-800 hover:text-slate-950 inline-flex items-center space-x-1"
            >
              <span>{language === 'hi' ? 'सभी 35+ योजनाएं व आवेदन विधि देखें' : 'View All 35+ Schemes & Guides'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredSchemes.map((scheme) => (
              <div
                key={scheme._id || scheme.slug}
                className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between hover:border-slate-400 transition-colors shadow-xs"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300">
                      {scheme.category}
                    </span>
                    <span className="text-[11px] font-mono font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {scheme.badge}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm leading-snug">
                    {scheme.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {scheme.shortDescription}
                  </p>

                  <div className="text-[11px] text-slate-500 border-t border-slate-100 pt-2">
                    <span className="font-medium text-slate-700">{language === 'hi' ? 'विभाग:' : 'Department:'}</span> {scheme.department}
                  </div>
                </div>

                <div className="pt-4 mt-2">
                  <Link
                    to={`/schemes?id=${scheme._id || scheme.slug}`}
                    className="text-xs font-bold text-slate-900 hover:text-amber-600 inline-flex items-center space-x-1"
                  >
                    <span>{language === 'hi' ? 'पात्रता व आवेदन प्रक्रिया देखें' : 'Eligibility & How to Apply'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
