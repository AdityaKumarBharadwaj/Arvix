import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  ShieldCheck,
  CreditCard,
  User,
  Phone,
  MapPin,
  Lock,
  AlertCircle,
  CheckCircle2,
  Building
} from 'lucide-react';

const RegisterPage = () => {
  const { register } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    aadhaarNumber: '',
    wardAddress: '',
    wardSector: 'Sector 2',
    voterId: '',
    password: '',
    confirmPassword: '',
    wardResidencyConfirmed: false
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
    const cleanAadhaar = formData.aadhaarNumber.replace(/[^0-9]/g, '');
    if (cleanAadhaar.length !== 12) {
      setError(language === 'hi' ? 'आधार कार्ड संख्या 12 अंकों की होनी अनिवार्य है।' : 'Aadhaar Card number must be exactly 12 digits.');
      return;
    }

    const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length !== 10) {
      setError(language === 'hi' ? 'कृपया मान्य 10-अंकों का मोबाइल नंबर दर्ज करें।' : 'Please enter a valid 10-digit mobile number.');
      return;
    }

    if (formData.password.length < 6) {
      setError(language === 'hi' ? 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।' : 'Password must be at least 6 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(language === 'hi' ? 'पासवर्ड और पुष्टि पासवर्ड मेल नहीं खाते।' : 'Passwords do not match.');
      return;
    }

    if (!formData.wardResidencyConfirmed) {
      setError(language === 'hi' ? 'कृपया प्रमाणित करें कि आप वार्ड संख्या 14 के स्थायी निवासी हैं।' : 'Please certify that you are a resident of Ward No. 14.');
      return;
    }

    setSubmitting(true);
    try {
      await register({
        name: formData.name,
        phone: cleanPhone,
        aadhaarNumber: cleanAadhaar,
        wardAddress: `${formData.wardAddress}, ${formData.wardSector}, Ward No. 14`,
        wardSector: formData.wardSector,
        voterId: formData.voterId,
        password: formData.password
      });

      navigate('/my-account');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-xl mx-auto">
      <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 border-b border-slate-100 pb-5">
          <div className="w-12 h-12 rounded-full bg-slate-900 text-emerald-400 flex items-center justify-center mx-auto shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 font-sans">
            {language === 'hi' ? 'वार्ड नागरिक सत्यापन एवं पंजीकरण' : 'Ward Citizen Aadhaar Verification & Registration'}
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {language === 'hi'
              ? 'फर्जी शिकायतों व स्पैम को रोकने हेतु केवल वार्ड संख्या 14 के निवासियों को आधार कार्ड से सत्यापित पंजीकरण की अनुमति है।'
              : 'To eliminate spam and ensure local governance integrity, only residents of Ward No. 14 with valid Aadhaar are registered.'}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-md text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Anti-Spam Security Notice */}
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md text-xs text-emerald-950 space-y-1">
          <div className="font-bold flex items-center space-x-1.5 font-mono text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{language === 'hi' ? 'नागरिक सुरक्षा एवं स्पैम रोकथाम गारंटी' : 'Verified Resident Anti-Spam Guarantee'}</span>
          </div>
          <p className="text-[11px] text-emerald-800 leading-relaxed">
            {language === 'hi'
              ? 'आपका आधार नंबर सुरक्षित रहता है और केवल अंतिम 4 अंक (जैसे XXXX-XXXX-1042) वार्ड रिकॉर्ड में प्रदर्शित किए जाते हैं।'
              : 'Your Aadhaar is protected and only the last 4 digits (e.g. XXXX-XXXX-1042) are displayed for municipal auditing.'}
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4 text-xs">
          {/* Full Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">
                {language === 'hi' ? 'पूरा नाम (आधार अनुसार) *' : 'Full Name (as per Aadhaar) *'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={language === 'hi' ? 'उदा. रमेश कुमार शर्मा' : 'e.g. Ramesh Kumar'}
                  className="civic-input pl-9 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">
                {language === 'hi' ? 'मोबाइल नंबर (10 अंक) *' : 'Mobile Phone (10 digits) *'}
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  required
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="98XXXXXXXX"
                  className="civic-input pl-9 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* 12-Digit Aadhaar Card */}
          <div>
            <label className="block text-[11px] font-bold text-slate-800 mb-1 font-mono uppercase tracking-wider">
              {language === 'hi' ? '12 अंकों का आधार कार्ड नंबर *' : '12-Digit Aadhaar Card Number *'}
            </label>
            <div className="relative">
              <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                maxLength={14}
                name="aadhaarNumber"
                value={formData.aadhaarNumber}
                onChange={handleInputChange}
                placeholder="XXXX-XXXX-XXXX (12 Digits)"
                className="civic-input pl-9 text-xs font-mono font-bold tracking-wider"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              {language === 'hi'
                ? 'वार्ड 14 में मतदाता / नागरिकता सत्यापन हेतु आधार कार्ड अनिवार्य है।'
                : 'Mandatory for zero-spam verification and Ward 14 resident welfare.'}
            </p>
          </div>

          {/* Ward 14 Sector & Street Address */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">
                {language === 'hi' ? 'वार्ड 14 सेक्टर / ब्लॉक *' : 'Ward 14 Sector *'}
              </label>
              <select
                name="wardSector"
                value={formData.wardSector}
                onChange={handleInputChange}
                className="civic-input text-xs"
              >
                <option value="Sector 1">Sector 1 (East Block)</option>
                <option value="Sector 2">Sector 2 (Central Market)</option>
                <option value="Sector 3">Sector 3 (West Colony)</option>
                <option value="Sector 4">Sector 4 (North Extension)</option>
                <option value="Block A">Block A Residential</option>
                <option value="Block B">Block B Residential</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-medium text-slate-700 mb-1">
                {language === 'hi' ? 'मकान नं., गली / मोहल्ला पता *' : 'House No., Street & Area Address *'}
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  name="wardAddress"
                  value={formData.wardAddress}
                  onChange={handleInputChange}
                  placeholder={language === 'hi' ? 'मकान नं. 42, गली नं. 3' : 'House 42, Gali No. 3'}
                  className="civic-input pl-9 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Passwords */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">
                {language === 'hi' ? 'पासवर्ड बनाएं *' : 'Create Password *'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="civic-input pl-9 text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">
                {language === 'hi' ? 'पासवर्ड की पुष्टि करें *' : 'Confirm Password *'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="civic-input pl-9 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Ward Residency Certify Checkbox */}
          <div className="pt-2">
            <label className="flex items-start space-x-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                required
                name="wardResidencyConfirmed"
                checked={formData.wardResidencyConfirmed}
                onChange={handleInputChange}
                className="mt-0.5 rounded text-slate-900 focus:ring-slate-950"
              />
              <span className="text-[11px] leading-tight">
                {language === 'hi'
                  ? 'मैं प्रमाणित करता/करती हूँ कि मैं वार्ड संख्या 14 का वास्तविक निवासी हूँ और दी गई आधार व पते की जानकारी सत्य है।'
                  : 'I hereby declare that I am a bonafide resident of Ward No. 14, and the Aadhaar number provided belongs to me.'}
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full civic-btn-primary text-xs py-2.5 font-bold"
          >
            {submitting
              ? (language === 'hi' ? 'आधार सत्यापन एवं पंजीकरण जारी...' : 'Verifying Aadhaar & Registering...')
              : (language === 'hi' ? 'आधार सत्यापित खाता बनाएं' : 'Verify Aadhaar & Register Citizen Account')}
          </button>
        </form>

        <div className="pt-2 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-600">
            {language === 'hi' ? 'पहले से खाता है? ' : 'Already registered? '}
            <Link to="/login" className="font-bold text-slate-900 underline hover:text-amber-600">
              {language === 'hi' ? 'यहाँ लॉगिन करें' : 'Sign In with Aadhaar'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
