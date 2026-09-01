import React, { useState, useEffect } from 'react';
import { Megaphone, AlertTriangle, Calendar, Info } from 'lucide-react';
import { announcementService } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

const AnnouncementTicker = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { language, t } = useLanguage();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await announcementService.getAll();
        if (res.success && res.announcements.length > 0) {
          setAnnouncements(res.announcements);
        }
      } catch (err) {
        console.warn('Could not load announcements', err.message);
      }
    };
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    if (announcements.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [announcements]);

  if (!announcements.length) return null;

  const current = announcements[currentIndex];

  const getUrgencyBadge = (urgency, category) => {
    if (urgency === 'Urgent' || category === 'Emergency Alert') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-rose-600 text-white animate-pulse">
          <AlertTriangle className="w-3 h-3 mr-1" />
          {language === 'hi' ? 'आपातकालीन सूचना' : 'EMERGENCY ALERT'}
        </span>
      );
    }
    if (category === 'Ward Function') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500 text-slate-950">
          <Calendar className="w-3 h-3 mr-1" />
          {language === 'hi' ? 'वार्ड कार्यक्रम / सभा' : 'WARD FUNCTION'}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-200">
        <Info className="w-3 h-3 mr-1" />
        {language === 'hi' ? 'सार्वजनिक सूचना' : 'PUBLIC NOTICE'}
      </span>
    );
  };

  return (
    <div className="bg-black border-b border-neutral-900 text-slate-100 py-2.5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-3 w-full sm:w-auto overflow-hidden">
          <div className="flex items-center space-x-1.5 shrink-0 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Megaphone className="w-4 h-4 animate-bounce" />
            <span>{t('bulletin')}</span>
          </div>

          <div className="flex items-center space-x-2.5 overflow-hidden text-xs">
            {getUrgencyBadge(current.urgency, current.category)}
            <span className="font-semibold text-white truncate max-w-xl">
              {current.title}
            </span>
            {current.eventDate && (
              <span className="hidden md:inline text-slate-400 font-mono text-[11px] shrink-0">
                [{current.eventDate}]
              </span>
            )}
          </div>
        </div>

        {announcements.length > 1 && (
          <div className="flex items-center space-x-2 text-[11px] text-slate-400 shrink-0 self-end sm:self-auto">
            <span>
              {currentIndex + 1} / {announcements.length}
            </span>
            <div className="flex space-x-1">
              <button
                onClick={() =>
                  setCurrentIndex((prev) => (prev - 1 + announcements.length) % announcements.length)
                }
                className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                ◀
              </button>
              <button
                onClick={() => setCurrentIndex((prev) => (prev + 1) % announcements.length)}
                className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                ▶
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementTicker;
