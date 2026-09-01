import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Shield,
  CreditCard,
  Lock,
  Mail,
  AlertCircle,
  UserCheck,
  CheckCircle2,
  Phone
} from 'lucide-react';

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState('citizen'); // 'citizen' or 'representative'
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const user = await login(identifier, password);
      if (user.role === 'representative' || user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/my-account');
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please verify your details.');
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemoCitizen = () => {
    setActiveTab('citizen');
    setIdentifier('543287651042'); // 12-digit demo Aadhaar
    setPassword('Citizen@2026');
  };

  const fillDemoRepresentative = () => {
    setActiveTab('representative');
    setIdentifier('representative@arvix.gov.in');
    setPassword('WardRep@2026');
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-md mx-auto">
      <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs space-y-6">
        {/* Top Icon & Title */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center mx-auto shadow-xs">
            {activeTab === 'citizen' ? <CreditCard className="w-6 h-6" /> : <Shield className="w-6 h-6" />}
          </div>
          <h2 className="text-xl font-bold text-slate-900 font-sans">
            {language === 'hi' ? 'वार्ड नागरिक एवं पार्षद लॉगिन' : 'Ward Citizen & Official Login'}
          </h2>
          <p className="text-xs text-slate-500">
            {language === 'hi'
              ? 'फर्जी शिकायतों व स्पैम की रोकथाम हेतु केवल सत्यापित वार्ड निवासियों को अनुमति है।'
              : 'Secure, anti-spam portal access for verified Ward No. 14 residents and officials.'}
          </p>
        </div>

        {/* Tab Switcher: Citizen vs Representative */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-lg text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('citizen');
              setIdentifier('');
              setPassword('');
              setError('');
            }}
            className={`py-2 rounded-md transition-all ${
              activeTab === 'citizen'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            👤 {language === 'hi' ? 'वार्ड नागरिक' : 'Ward Citizen'}
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('representative');
              setIdentifier('');
              setPassword('');
              setError('');
            }}
            className={`py-2 rounded-md transition-all ${
              activeTab === 'representative'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🏛️ {language === 'hi' ? 'पार्षद / अधिकारी' : 'Ward Official'}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-md text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Demo Credentials Quick Pill */}
        {activeTab === 'citizen' ? (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-emerald-950">
                {language === 'hi' ? 'सत्यापित वार्ड नागरिक डेमो' : 'Verified Resident Citizen Demo'}
              </div>
              <div className="text-[10px] text-emerald-800 font-mono">
                Aadhaar: 5432-8765-1042
              </div>
            </div>
            <button
              type="button"
              onClick={fillDemoCitizen}
              className="px-2.5 py-1 bg-emerald-700 text-white rounded text-[11px] font-bold hover:bg-emerald-800"
            >
              {language === 'hi' ? 'डेमो भरें' : 'Fill Demo'}
            </button>
          </div>
        ) : (
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-md flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-slate-900">
                {language === 'hi' ? 'वार्ड पार्षद डेमो' : 'Ward Representative Demo'}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">representative@arvix.gov.in</div>
            </div>
            <button
              type="button"
              onClick={fillDemoRepresentative}
              className="px-2.5 py-1 bg-slate-900 text-white rounded text-[11px] font-bold hover:bg-slate-800"
            >
              {language === 'hi' ? 'डेमो भरें' : 'Fill Demo'}
            </button>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              {activeTab === 'citizen'
                ? (language === 'hi' ? 'आधार कार्ड नंबर (12 अंक) या पंजीकृत मोबाइल' : '12-Digit Aadhaar Card or Mobile')
                : (language === 'hi' ? 'आधिकारिक ईमेल पता' : 'Official Email Address')}
            </label>
            <div className="relative">
              {activeTab === 'citizen' ? (
                <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              ) : (
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              )}
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={
                  activeTab === 'citizen'
                    ? (language === 'hi' ? '12 अंकों का आधार या मोबाइल' : 'e.g. 543287651042 or 9810145678')
                    : 'representative@arvix.gov.in'
                }
                className="civic-input pl-9 text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              {language === 'hi' ? 'गोपनीय पासवर्ड' : 'Secret Password'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="civic-input pl-9 text-xs font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full civic-btn-primary text-xs py-2.5 font-bold"
          >
            {submitting
              ? (language === 'hi' ? 'सत्यापन हो रहा है...' : 'Verifying Credentials...')
              : (language === 'hi' ? 'पोर्टल में प्रवेश करें' : 'Sign In to Portal')}
          </button>
        </form>

        {/* Register Link */}
        <div className="pt-2 border-t border-slate-100 text-center space-y-2">
          <p className="text-xs text-slate-600">
            {language === 'hi' ? 'वार्ड संख्या 14 के नए नागरिक? ' : 'New Ward 14 resident? '}
            <Link to="/register" className="font-bold text-slate-900 underline hover:text-amber-600">
              {language === 'hi' ? 'आधार कार्ड से पंजीकरण करें' : 'Register with Aadhaar Card'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
