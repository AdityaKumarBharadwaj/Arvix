import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ComplaintForm from '../components/complaints/ComplaintForm';
import ComplaintTracker from '../components/complaints/ComplaintTracker';
import { ShieldCheck, Clock, FileCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const ComplaintsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('id') ? 'track' : (searchParams.get('tab') || 'file');
  const [activeTab, setActiveTab] = useState(initialTab);
  const { language, t } = useLanguage();

  useEffect(() => {
    if (searchParams.get('id')) {
      setActiveTab('track');
    }
  }, [searchParams]);

  return (
    <div className="py-8 lg:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Page Header */}
        <div className="border-b border-slate-200 pb-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                {language === 'hi' ? 'वार्ड संख्या 14 शिकायत निवारण' : 'Ward No. 14 Grievance Redressal'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans mt-0.5">
                {language === 'hi'
                  ? 'नागरिक शिकायत एवं लोक निर्माण निवारण पोर्टल'
                  : 'Citizen Grievance & Public Works Redressal Portal'}
              </h1>
            </div>

            {/* SLA Badges */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="inline-flex items-center px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
                <Clock className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                {language === 'hi' ? 'गारंटीड निरीक्षण: < 48 घंटे' : 'Guaranteed Inspection: < 48 Hrs'}
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-2 mt-6">
            <button
              onClick={() => setActiveTab('file')}
              className={`px-4 py-2.5 rounded-md text-xs font-bold transition-all ${
                activeTab === 'file'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              ✍️ {language === 'hi' ? 'नई शिकायत दर्ज करें' : 'Lodge New Grievance'}
            </button>
            <button
              onClick={() => setActiveTab('track')}
              className={`px-4 py-2.5 rounded-md text-xs font-bold transition-all ${
                activeTab === 'track'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              🔍 {language === 'hi' ? 'ट्रैकिंग आईडी से स्थिति जांचें' : 'Track Status via Tracking ID'}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'file' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8">
              <ComplaintForm
                onComplaintCreated={(id) => {
                  setSearchParams({ id });
                  setActiveTab('track');
                }}
              />
            </div>

            {/* Right: Citizen Charter & Tips */}
            <div className="lg:col-span-4 space-y-5">
              <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
                <div className="flex items-center space-x-2 text-slate-900 font-bold text-xs uppercase tracking-wider font-mono">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{language === 'hi' ? 'वार्ड 14 नागरिक सेवा गारंटी (SLA)' : 'Ward 14 Citizen Charter SLA'}</span>
                </div>
                <div className="divide-y divide-slate-100 text-xs text-slate-600">
                  <div className="py-2 flex justify-between">
                    <span>{language === 'hi' ? 'गंदा पानी / पाइपलाइन लीकेज:' : 'Water Contamination / Burst:'}</span>
                    <strong className="font-mono text-slate-900">{language === 'hi' ? '24 घंटे में' : 'Within 24 Hours'}</strong>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span>{language === 'hi' ? 'स्ट्रीट लाइट बंद खंभे:' : 'Streetlight Dark Poles:'}</span>
                    <strong className="font-mono text-slate-900">{language === 'hi' ? '48 घंटे में' : 'Within 48 Hours'}</strong>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span>{language === 'hi' ? 'सड़क के गड्ढे एवं डामर:' : 'Road Potholes & Craters:'}</span>
                    <strong className="font-mono text-slate-900">{language === 'hi' ? '72 घंटे में' : 'Within 72 Hours'}</strong>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span>{language === 'hi' ? 'सरकारी स्कूल बुनियादी ढांचा:' : 'Govt School Infrastructure:'}</span>
                    <strong className="font-mono text-slate-900">{language === 'hi' ? 'प्राथमिकता (48 घंटे)' : 'Priority Review (48h)'}</strong>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 text-slate-200 rounded-lg p-5 border border-slate-800 text-xs space-y-2">
                <div className="font-bold text-white uppercase tracking-wider font-mono text-[11px] flex items-center">
                  <FileCheck className="w-4 h-4 mr-1 text-amber-400" />
                  <span>{language === 'hi' ? 'महत्वपूर्ण शिकायत निर्देश' : 'Important Filing Instructions'}</span>
                </div>
                <ul className="space-y-1.5 text-slate-300 list-disc list-inside text-[11px]">
                  {language === 'hi' ? (
                    <>
                      <li>सटीक लैंडमार्क दें (जैसे मकान नं 45 के सामने या मंदिर के पास)।</li>
                      <li>स्पष्ट फोटो संलग्न करने से ऑन-ग्राउंड जांच 60% तेजी से होती है।</li>
                      <li>अपना 10-अंकों का मोबाइल नंबर सक्रिय रखें ताकि इंजीनियर संपर्क कर सके।</li>
                    </>
                  ) : (
                    <>
                      <li>Provide exact landmarks (e.g., opposite House #45 or near ATM).</li>
                      <li>Clear photographs speed up on-ground inspection by 60%.</li>
                      <li>Keep your 10-digit mobile number active for engineer contact.</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <ComplaintTracker />
        )}
      </div>
    </div>
  );
};

export default ComplaintsPage;
