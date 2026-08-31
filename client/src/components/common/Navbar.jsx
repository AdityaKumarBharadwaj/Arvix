import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Landmark,
  Shield,
  Menu,
  X,
  UserCheck,
  LogOut,
  User,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isRepresentative, isCitizen, logout } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();

  const navLinks = [
    { name: t('navHome'), path: '/' },
    { name: t('navFileComplaint'), path: '/complaints' },
    { name: t('navTrackStatus'), path: '/complaints/track' },
    { name: t('navGovtSchemes'), path: '/schemes' },
    { name: t('navMarriageHall'), path: '/hall-booking' },
    { name: t('navMedicineRation'), path: '/medicine-and-ration' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Civic Branding */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-md bg-slate-900 text-white flex items-center justify-center shadow-xs border border-slate-800 group-hover:bg-slate-800 transition-colors">
                <Landmark className="w-5 h-5 text-amber-400" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-1.5">
                  <span className="text-xl font-extrabold tracking-tight text-slate-950 font-sans">
                    ARVIX
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300">
                    {language === 'hi' ? 'वार्ड 14' : 'Ward 14'}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">
                  {t('subTitle')}
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-slate-950 bg-slate-100 border border-slate-200 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Action / Auth Status */}
          <div className="hidden lg:flex items-center space-x-3">
            {isRepresentative ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/admin"
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-amber-50 text-amber-900 border border-amber-300 text-xs font-semibold hover:bg-amber-100 transition-colors"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-700" />
                  <span>{t('navRepPanel')}</span>
                </Link>
                <button
                  onClick={logout}
                  title={t('logout')}
                  className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-md transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : isCitizen ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/my-account"
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-emerald-50 text-emerald-900 border border-emerald-300 text-xs font-semibold hover:bg-emerald-100 transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{user.name.split(' ')[0]} ({language === 'hi' ? 'निवासी खाता' : 'Resident'})</span>
                </Link>
                <button
                  onClick={logout}
                  title={t('logout')}
                  className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-md transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="inline-flex items-center space-x-1 px-3 py-1.5 border border-slate-300 rounded-md text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                >
                  <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                  <span>{language === 'hi' ? 'नागरिक लॉगिन' : 'Citizen Login'}</span>
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors"
                >
                  <CreditCard className="w-3 h-3 text-amber-400" />
                  <span>{language === 'hi' ? 'आधार पंजीकरण' : 'Aadhaar Register'}</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger Button */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              onClick={toggleLanguage}
              className="p-1.5 text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 rounded"
            >
              {language === 'hi' ? 'EN' : 'हिन्दी'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive(link.path)
                  ? 'bg-slate-100 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            {isRepresentative ? (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-md text-sm"
              >
                {t('navRepPanel')}
              </Link>
            ) : isCitizen ? (
              <Link
                to="/my-account"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center px-4 py-2 bg-emerald-600 text-white font-bold rounded-md text-sm"
              >
                {language === 'hi' ? 'मेरा निवासी खाता (शिकायतें व बुकिंग)' : 'My Resident Account'}
              </Link>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-3 py-2 border border-slate-300 bg-white text-slate-900 font-medium rounded-md text-xs"
                >
                  {language === 'hi' ? 'नागरिक लॉगिन' : 'Citizen Login'}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-3 py-2 bg-slate-900 text-white font-bold rounded-md text-xs"
                >
                  {language === 'hi' ? 'आधार पंजीकरण' : 'Register with Aadhaar'}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
