import React, { useState, useEffect } from 'react';
import { scheduleService } from '../services/api';
import {
  Pill,
  ShoppingBag,
  Clock,
  MapPin,
  Phone,
  User,
  ShieldCheck,
  Calendar,
  Search
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const MedicineAndRationPage = () => {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('medicine');
  const [medicineData, setMedicineData] = useState(null);
  const [rationData, setRationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [medicineSearch, setMedicineSearch] = useState('');

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true);
        const [medRes, ratRes] = await Promise.all([
          scheduleService.getMedicineSchedule(),
          scheduleService.getRationSchedule()
        ]);
        if (medRes.success) setMedicineData(medRes.medicineSchedule);
        if (ratRes.success) setRationData(ratRes.rationSchedule);
      } catch (err) {
        console.error('Error fetching schedules:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedules();
  }, []);

  const filteredMedicines = medicineData?.availableMedicines?.filter(
    (m) =>
      m.name.toLowerCase().includes(medicineSearch.toLowerCase()) ||
      m.category.toLowerCase().includes(medicineSearch.toLowerCase()) ||
      m.dosageNotes.toLowerCase().includes(medicineSearch.toLowerCase())
  ) || [];

  return (
    <div className="py-8 lg:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="border-b border-slate-200 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                {language === 'hi' ? 'सार्वजनिक स्वास्थ्य एवं खाद्य सुरक्षा सेवाएं' : 'Public Health & Food Security Services'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans mt-0.5">
                {language === 'hi'
                  ? 'निःशुल्क दवा एवं निःशुल्क राशन वितरण समय-सारणी'
                  : 'Free Medicine & Free Ration Scheme Timetable'}
              </h1>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                {language === 'hi'
                  ? 'वार्ड 14 के लिए आधिकारिक वितरण समय, डॉक्टर उपलब्धता, आवश्यक जेनेरिक दवा सूची एवं सरकारी उचित दर राशन दुकान (FPS) की टोकन समय-सारणी।'
                  : 'Official distribution hours, doctor availability, free generic medicine inventory, and Fair Price Shop (FPS) foodgrain token schedules for Ward No. 14.'}
              </p>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <span className="px-3 py-1.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold font-mono">
                {language === 'hi' ? '100% निःशुल्क सार्वजनिक सेवाएं' : '100% Free Public Entitlements'}
              </span>
            </div>
          </div>

          {/* Navigation Toggle Buttons */}
          <div className="flex space-x-2 mt-6">
            <button
              onClick={() => setActiveTab('medicine')}
              className={`px-4 py-2.5 rounded-md text-xs font-bold transition-all flex items-center space-x-2 ${
                activeTab === 'medicine'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Pill className={`w-3.5 h-3.5 ${activeTab === 'medicine' ? 'text-amber-400' : 'text-slate-500'}`} />
              <span>{t('medTab')}</span>
            </button>
            <button
              onClick={() => setActiveTab('ration')}
              className={`px-4 py-2.5 rounded-md text-xs font-bold transition-all flex items-center space-x-2 ${
                activeTab === 'ration'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <ShoppingBag className={`w-3.5 h-3.5 ${activeTab === 'ration' ? 'text-amber-400' : 'text-slate-500'}`} />
              <span>{t('rationTab')}</span>
            </button>
          </div>
        </div>

        {/* ================= SECTION 1: MEDICINE SCHEDULE ================= */}
        {activeTab === 'medicine' && medicineData && (
          <div className="space-y-8">
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <div className="inline-flex items-center space-x-1.5 text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{language === 'hi' ? 'शासन अधिकृत शहरी प्राथमिक स्वास्थ्य केंद्र' : 'Government Authorized Urban Dispensary'}</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 font-sans">
                    {medicineData.facilityName}
                  </h2>
                  <p className="text-xs text-slate-600 flex items-start space-x-1">
                    <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                    <span>{medicineData.address}</span>
                  </p>
                  <p className="text-xs text-slate-600 flex items-center space-x-1">
                    <User className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>
                      <strong>{language === 'hi' ? 'प्रभारी चिकित्सा अधिकारी:' : 'Chief Medical Officer:'}</strong> {medicineData.medicalOfficer}
                    </span>
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-md text-xs space-y-2 self-center">
                  <div className="font-bold text-slate-800 uppercase tracking-wider font-mono text-[11px]">
                    {language === 'hi' ? 'आपातकालीन औषधालय फोन' : 'Emergency Dispensary Desk'}
                  </div>
                  <div className="flex items-center space-x-1.5 font-mono text-slate-900 font-bold">
                    <Phone className="w-3.5 h-3.5 text-amber-600" />
                    <span>{medicineData.contactPhone}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {language === 'hi' ? 'सरकारी एम्बुलेंस सेवा: ' : 'Free ambulance: '}
                    <strong>102 / 108</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Operating Hours Timetable */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <Clock className="w-5 h-5 text-slate-900" />
                <h3 className="font-bold text-base text-slate-900 font-sans">
                  {t('operatingHours')}
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200">
                  <thead className="bg-slate-100 font-mono text-slate-700">
                    <tr>
                      <th className="p-3 border-b border-slate-200 font-bold">
                        {language === 'hi' ? 'सत्र एवं दिन' : 'Session & Days'}
                      </th>
                      <th className="p-3 border-b border-slate-200 font-bold">
                        {language === 'hi' ? 'समय' : 'Timings'}
                      </th>
                      <th className="p-3 border-b border-slate-200 font-bold">
                        {language === 'hi' ? 'उपलब्ध सेवाएं एवं दवा वितरण' : 'Services & Dispensing'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {medicineData.operatingSchedule.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-3 font-semibold text-slate-900">{item.dayRange}</td>
                        <td className="p-3 font-mono font-bold text-slate-800 whitespace-nowrap">{item.hours}</td>
                        <td className="p-3 text-slate-600">{item.service}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-amber-50/70 border border-amber-200 p-3 rounded-md text-xs text-amber-900 space-y-1">
                <div className="font-bold text-[11px] uppercase tracking-wider font-mono">
                  {language === 'hi' ? 'नागरिकों हेतु आवश्यक दिशा-निर्देश:' : 'General Instructions for Residents:'}
                </div>
                {medicineData.guidelines.map((g, idx) => (
                  <p key={idx} className="text-[11px]">• {g}</p>
                ))}
              </div>
            </div>

            {/* Free Medicine Catalog */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <Pill className="w-5 h-5 text-rose-500" />
                  <h3 className="font-bold text-base text-slate-900 font-sans">
                    {t('essentialMeds')}
                  </h3>
                </div>

                <div className="w-full sm:w-64 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={medicineSearch}
                    onChange={(e) => setMedicineSearch(e.target.value)}
                    placeholder={language === 'hi' ? 'दवा का नाम खोजें...' : 'Search medicine name...'}
                    className="civic-input pl-8 py-1.5 text-xs"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200">
                  <thead className="bg-slate-100 font-mono text-slate-700">
                    <tr>
                      <th className="p-2.5 border-b border-slate-200 font-bold">
                        {language === 'hi' ? 'दवा का नाम' : 'Medicine Name'}
                      </th>
                      <th className="p-2.5 border-b border-slate-200 font-bold">
                        {language === 'hi' ? 'वर्ग / श्रेणी' : 'Therapeutic Category'}
                      </th>
                      <th className="p-2.5 border-b border-slate-200 font-bold">
                        {language === 'hi' ? 'स्टॉक स्थिति' : 'Stock Status'}
                      </th>
                      <th className="p-2.5 border-b border-slate-200 font-bold">
                        {language === 'hi' ? 'रोग निवारण / उपयोग' : 'Purpose / Notes'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredMedicines.map((med, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-2.5 font-bold text-slate-900">{med.name}</td>
                        <td className="p-2.5 text-slate-600 font-medium">{med.category}</td>
                        <td className="p-2.5">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono">
                            ✓ {language === 'hi' ? 'उपलब्ध (In Stock)' : med.stockStatus}
                          </span>
                        </td>
                        <td className="p-2.5 text-slate-600 text-[11px]">{med.dosageNotes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Health Camps */}
            {medicineData.upcomingHealthCamps && (
              <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-4">
                <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-base text-slate-900 font-sans">
                    {language === 'hi' ? 'वार्ड 14 में आगामी विशेष निःशुल्क स्वास्थ्य शिविर' : 'Upcoming Specialized Health Camps in Ward 14'}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {medicineData.upcomingHealthCamps.map((camp, idx) => (
                    <div key={idx} className="border border-slate-200 p-4 rounded-md bg-slate-50 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[11px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                          {camp.date}
                        </span>
                        <span className="text-[11px] font-mono text-slate-600">{camp.timing}</span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900">{camp.title}</h4>
                      <p className="text-xs text-slate-600">{camp.services}</p>
                      <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                        <strong>{language === 'hi' ? 'स्थान:' : 'Venue:'}</strong> {camp.venue} • <strong>{language === 'hi' ? 'विशेषज्ञ:' : 'Specialists:'}</strong> {camp.specialists}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= SECTION 2: RATION SCHEDULE ================= */}
        {activeTab === 'ration' && rationData && (
          <div className="space-y-8">
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <div className="inline-flex items-center space-x-1.5 text-xs font-mono font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{language === 'hi' ? 'खाद्य एवं रसद विभाग अधिकृत उचित दर राशन डिपो' : 'Government Food & Civil Supplies Authorized Depot'}</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 font-sans">
                    {rationData.fpsNumber}
                  </h2>
                  <p className="text-xs text-slate-600 flex items-start space-x-1">
                    <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                    <span>{rationData.location}</span>
                  </p>
                  <p className="text-xs text-slate-600 flex items-center space-x-1">
                    <User className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>
                      <strong>{language === 'hi' ? 'अधिकृत कोटेदार / डीलर:' : 'Authorized Dealer:'}</strong> {rationData.dealerName}
                    </span>
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-md text-xs space-y-2 self-center">
                  <div className="font-bold text-slate-800 uppercase tracking-wider font-mono text-[11px]">
                    {language === 'hi' ? 'राशन दुकान संपर्क' : 'Fair Price Shop Helpline'}
                  </div>
                  <div className="flex items-center space-x-1.5 font-mono text-slate-900 font-bold">
                    <Phone className="w-3.5 h-3.5 text-slate-700" />
                    <span>{rationData.contactPhone}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {language === 'hi' ? 'राज्य खाद्य टोल-फ्री हेल्पलाइन: ' : 'State Food Helpline: '}
                    <strong>1967</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Operational Timings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-slate-200 p-4 rounded-lg space-y-1">
                <div className="text-[11px] font-mono uppercase text-slate-500 font-bold">
                  {language === 'hi' ? 'मासिक वितरण अवधि' : 'Monthly Distribution Period'}
                </div>
                <div className="text-base font-extrabold text-slate-900">
                  {language === 'hi' ? 'प्रत्येक माह की 1 से 20 तारीख' : rationData.monthlyDistributionPeriod}
                </div>
                <div className="text-xs text-slate-500">
                  {language === 'hi' ? 'सभी कार्ड श्रेणियों हेतु चरणबद्ध वितरण' : 'All card tiers serviced in rotation'}
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-4 rounded-lg space-y-1">
                <div className="text-[11px] font-mono uppercase text-slate-500 font-bold">
                  {language === 'hi' ? 'दुकान खुलने का समय (शिफ्ट)' : 'Daily Working Shifts'}
                </div>
                <div className="text-sm font-bold text-slate-900 font-mono">
                  {language === 'hi' ? 'प्रातः सत्र: ' : 'Morning: '}{rationData.dailyTimings.morningShift}
                </div>
                <div className="text-sm font-bold text-slate-900 font-mono">
                  {language === 'hi' ? 'सायं सत्र: ' : 'Evening: '}{rationData.dailyTimings.eveningShift}
                </div>
              </div>

              <div className="bg-white border border-slate-200 p-4 rounded-lg space-y-1">
                <div className="text-[11px] font-mono uppercase text-slate-500 font-bold">
                  {language === 'hi' ? 'साप्ताहिक बंदी' : 'Weekly Closed Day'}
                </div>
                <div className="text-base font-extrabold text-rose-700">
                  {language === 'hi' ? 'प्रत्येक मंगलवार (स्टॉक मिलान दिवस)' : rationData.dailyTimings.weeklyOff}
                </div>
                <div className="text-xs text-slate-500">
                  {language === 'hi' ? 'गोदाम उठान एवं ई-पॉस मिलान' : 'Stock accounting & godown transfer'}
                </div>
              </div>
            </div>

            {/* Quota Breakdown */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
                <ShoppingBag className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-base text-slate-900 font-sans">
                  {language === 'hi'
                    ? 'राशन कार्ड श्रेणीवार मासिक खाद्यान्न कोटा (PMGKAY योजना अंतर्गत)'
                    : 'Monthly Foodgrain Quota Entitlements (Under PMGKAY Scheme)'}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {rationData.cardTiers.map((tier, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-md p-4 bg-slate-50 space-y-2 flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="font-bold text-sm text-slate-900">{tier.cardType}</div>
                      <div className="text-[11px] text-slate-500">{tier.eligibility}</div>
                    </div>
                    <div className="pt-2 border-t border-slate-200">
                      <div className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100/60 p-2 rounded">
                        {tier.quota}
                      </div>
                      <div className="text-[11px] font-semibold text-slate-700 mt-1">
                        {language === 'hi' ? 'मूल्य: ' : 'Fee: '}
                        <span className="text-emerald-700">{tier.cost}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Token Schedule Table */}
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-slate-900" />
                  <h3 className="font-bold text-base text-slate-900 font-sans">
                    {t('tokenSchedule')}
                  </h3>
                </div>
                <span className="text-xs font-mono text-slate-500">
                  {language === 'hi' ? 'वार्ड संख्या 14 डिपो' : 'Ward No. 14 Fair Price Depot'}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200">
                  <thead className="bg-slate-100 font-mono text-slate-700">
                    <tr>
                      <th className="p-3 border-b border-slate-200 font-bold">
                        {language === 'hi' ? 'राशन कार्ड का अंतिम अंक' : 'Ration Card Last Digit'}
                      </th>
                      <th className="p-3 border-b border-slate-200 font-bold">
                        {language === 'hi' ? 'निर्धारित वितरण तिथियां' : 'Designated Distribution Days'}
                      </th>
                      <th className="p-3 border-b border-slate-200 font-bold">
                        {language === 'hi' ? 'उपलब्ध शिफ्ट' : 'Available Shifts'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rationData.tokenSchedule.map((slot, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-slate-900">{slot.endingDigits}</td>
                        <td className="p-3 font-semibold text-emerald-800">{slot.allocatedDays}</td>
                        <td className="p-3 text-slate-600">{slot.shift}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mandatory Guidelines */}
            <div className="bg-slate-900 text-slate-200 rounded-lg p-5 border border-slate-800 text-xs space-y-2">
              <div className="font-bold text-white uppercase tracking-wider font-mono text-[11px] flex items-center">
                <ShieldCheck className="w-4 h-4 mr-1 text-emerald-400" />
                <span>{language === 'hi' ? 'राशन प्राप्त करने हेतु आवश्यक नियम' : 'Mandatory Instructions for Ration Collection'}</span>
              </div>
              <ul className="space-y-1.5 text-slate-300 list-disc list-inside text-[11px]">
                {rationData.mandatoryInstructions.map((inst, idx) => (
                  <li key={idx}>{inst}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicineAndRationPage;
