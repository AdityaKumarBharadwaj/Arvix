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
  CheckCircle,
  FileText,
  Calendar,
  Pill,
  ShoppingBag,
  Clock,
  PhoneCall,
  ExternalLink
} from 'lucide-react';
import { schemeService, hallService, scheduleService } from '../services/api';

const HomePage = () => {
  const [featuredSchemes, setFeaturedSchemes] = useState([]);
  const [hallData, setHallData] = useState(null);
  const [medicineSchedule, setMedicineSchedule] = useState(null);
  const [rationSchedule, setRationSchedule] = useState(null);

  useEffect(() => {
    // Load snapshot data for home preview
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
                Municipal Grievance System
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-sans">
                What Can You Report in Ward 14?
              </h2>
            </div>
            <Link
              to="/complaints"
              className="text-xs font-semibold text-slate-800 hover:text-slate-950 inline-flex items-center space-x-1"
            >
              <span>Lodge New Complaint</span>
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
                <h3 className="font-bold text-sm text-slate-900">Roads & Potholes</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Damaged asphalt, craters, open footpaths, and unfinished road-cutting work.
                </p>
              </div>
              <Link
                to="/complaints?cat=Road"
                className="mt-4 text-[11px] font-bold text-slate-700 hover:text-slate-950 inline-flex items-center"
              >
                Report Road Issue →
              </Link>
            </div>

            {/* Category: Water */}
            <div className="bg-white border border-slate-200 p-4 rounded-lg flex flex-col justify-between hover:border-slate-400 transition-colors">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Droplet className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">Water Supply</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Pipeline leakages, low pressure, dirty/contaminated water, or valve fault.
                </p>
              </div>
              <Link
                to="/complaints?cat=Water"
                className="mt-4 text-[11px] font-bold text-slate-700 hover:text-slate-950 inline-flex items-center"
              >
                Report Water Issue →
              </Link>
            </div>

            {/* Category: Schools */}
            <div className="bg-white border border-slate-200 p-4 rounded-lg flex flex-col justify-between hover:border-slate-400 transition-colors">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <School className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">Govt Schools</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Classroom fans, drinking water facilities, mid-day meal, toilets & safety walls.
                </p>
              </div>
              <Link
                to="/complaints?cat=School"
                className="mt-4 text-[11px] font-bold text-slate-700 hover:text-slate-950 inline-flex items-center"
              >
                Report School Issue →
              </Link>
            </div>

            {/* Category: Electricity */}
            <div className="bg-white border border-slate-200 p-4 rounded-lg flex flex-col justify-between hover:border-slate-400 transition-colors">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded bg-yellow-50 text-yellow-700 flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">Street Lighting</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Dark lamp poles, loose electric wires, blinking streetlights, or transformer safety.
                </p>
              </div>
              <Link
                to="/complaints?cat=Electricity"
                className="mt-4 text-[11px] font-bold text-slate-700 hover:text-slate-950 inline-flex items-center"
              >
                Report Electric Issue →
              </Link>
            </div>

            {/* Category: Sanitation */}
            <div className="bg-white border border-slate-200 p-4 rounded-lg flex flex-col justify-between hover:border-slate-400 transition-colors">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded bg-purple-50 text-purple-700 flex items-center justify-center">
                  <Trash2 className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">Sanitation & Drains</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Garbage pile cleanup, open drain overflow, public dustbin clearance & fumigation.
                </p>
              </div>
              <Link
                to="/complaints?cat=Sanitation"
                className="mt-4 text-[11px] font-bold text-slate-700 hover:text-slate-950 inline-flex items-center"
              >
                Report Sanitation Issue →
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
                  Live Slot Availability
                </span>
                <span className="text-xs text-slate-500 font-mono">Capacity: 850 Guests</span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Ward 14 Community Vivah Bhavan & Marriage Hall
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Subsidized community marriage hall for ward residents equipped with central air-conditioning, generator backup, dedicated bride/groom green rooms, and ample parking.
                </p>
              </div>

              {/* Booking Status Legend Preview */}
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-md flex items-center justify-around text-xs font-medium">
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                  <span className="text-slate-700">Free Dates (Available)</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
                  <span className="text-slate-700">Booked Dates</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-amber-400 inline-block"></span>
                  <span className="text-slate-700">Under Review</span>
                </div>
              </div>

              <div className="text-xs text-slate-600 space-y-1">
                <p className="font-semibold text-slate-800">Key Amenities Included:</p>
                <p className="text-[11px] text-slate-500">
                  ✓ Central AC Main Auditorium • Commercial Kitchen • RO Plant • Covered Parking • 24/7 Power Backup
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500 font-medium">Subsidized Tariff:</div>
                <div className="text-sm font-bold text-slate-900 font-mono">₹12,000 / Day</div>
              </div>
              <Link
                to="/hall-booking"
                className="civic-btn-primary text-xs px-4 py-2"
              >
                <span>Check Month Calendar</span>
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
                  Free Citizen Entitlements
                </span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  100% Free
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Free Medicine Dispensary & Fair Price Ration Shop
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Verify operating hours, doctor on duty, available in-stock generic medicines, and Fair Price Shop (FPS) foodgrain distribution token dates.
                </p>
              </div>

              {/* Two Column Mini Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-md space-y-1.5">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-900">
                    <Pill className="w-3.5 h-3.5 text-rose-500" />
                    <span>Urban PHC Dispensary</span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-mono">
                    Mon–Sat: 8:30 AM – 1:30 PM
                  </p>
                  <p className="text-[11px] text-slate-500">
                    10+ essential medicines in stock, free sugar & BP checks.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3 rounded-md space-y-1.5">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-900">
                    <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />
                    <span>Fair Price Ration Depot</span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-mono">
                    1st–20th: 8 AM–12:30 PM & 4–7:30 PM
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Free grain quota for AAY & PHH cardholders under PMGKAY.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Dealer Contact & Stock Inventory updated weekly
              </span>
              <Link
                to="/medicine-and-ration"
                className="civic-btn-secondary text-xs px-4 py-2"
              >
                <span>View Full Timetable</span>
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
                Public Welfare Portal
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-sans">
                Popular Government Schemes
              </h2>
            </div>
            <Link
              to="/schemes"
              className="text-xs font-semibold text-slate-800 hover:text-slate-950 inline-flex items-center space-x-1"
            >
              <span>View All 35+ Schemes & Guides</span>
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
                    <span className="font-medium text-slate-700">Department:</span> {scheme.department}
                  </div>
                </div>

                <div className="pt-4 mt-2">
                  <Link
                    to={`/schemes?id=${scheme._id || scheme.slug}`}
                    className="text-xs font-bold text-slate-900 hover:text-amber-600 inline-flex items-center space-x-1"
                  >
                    <span>Eligibility & How to Apply</span>
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
