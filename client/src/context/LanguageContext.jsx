import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    // Utility Bar & Header
    wardTitle: 'WARD NO. 14 • CENTRAL MUNICIPAL CORPORATION',
    officeHours: 'Office: Mon–Sat 9:00 AM – 5:30 PM',
    tollFree: 'Toll-Free Helpline:',
    emergencyJal: 'Emergency Jal / Electric:',
    subTitle: 'Ward Citizen Services & Grievance Redressal Portal',

    // Nav
    navHome: 'Home',
    navFileComplaint: 'File Grievance',
    navTrackStatus: 'Track Status',
    navGovtSchemes: 'Govt Schemes',
    navMarriageHall: 'Marriage Hall',
    navMedicineRation: 'Free Medicine & Ration',
    navRepLogin: 'Representative Login',
    navRepPanel: 'Ward Rep Panel',
    logout: 'Logout',

    // Hero
    heroBadge: 'Ward No. 14 Citizen Redressal Portal',
    heroSubBadge: 'Civic Governance Desk',
    heroHeading: 'Direct Civic Action for Roads, Water & Schools in Your Ward',
    heroDescription: 'Lodge complaints directly with your elected Ward Representative, track repair progress with live updates, access government welfare schemes, inspect marriage hall open dates, and review free medicine & ration schedules.',
    trackPlaceholder: 'Enter Tracking ID (e.g. ARV-2026-1042) or Phone',
    btnTrackStatus: 'Track Status',
    slaBadge: 'Verified Municipal SLA: 48–72 Hrs',
    servicesBadge: 'Roads • Water • Schools • Lights',

    // Hero 4 Action Pillars
    cardGrievanceTitle: 'Raise Grievance',
    cardGrievanceDesc: 'Report road potholes, dirty water supply, or govt school repair issues.',
    cardGrievanceBtn: 'Lodge Complaint',
    cardSchemesTitle: 'Welfare Schemes',
    cardSchemesDesc: 'Browse schemes with eligibility, required docs & steps to apply.',
    cardSchemesBtn: 'Explore Schemes',
    cardHallTitle: 'Community Vivah Bhavan',
    cardHallDesc: 'Inspect booked & free dates on the month calendar and book slots.',
    cardHallBtn: 'View Calendar',
    cardMedRationTitle: 'Medicine & Ration',
    cardMedRationDesc: 'UPHC dispensary timings, stock list & Fair Price Ration shop dates.',
    cardMedRationBtn: 'Check Timings',

    // Stats
    statResolutionRate: 'Resolution Rate',
    statRedressed: 'Complaints Redressed',
    statActiveSchemes: 'Active Govt Schemes',
    statFreeBenefit: 'Generic Meds & Ration',

    // Representative Card
    repName: 'Shri Rajeshwar Verma',
    repDesignation: 'Ward Councilor / Elected Representative',
    repQuote: '"Serving Ward 14 with prompt grievance redressal, quality public schools, reliable water supply, and complete transparency in local development funds."',
    repDirectOffice: 'Direct Office:',
    repSabhaTimings: 'Public Sabha:',
    repSabhaValue: 'Tue & Thu (10 AM – 1 PM)',
    repOfficeLoc: 'Office:',
    repOfficeValue: 'Community Center, Sector 2',

    // Grievance Categories
    catRoad: 'Roads & Potholes',
    catRoadDesc: 'Craters, broken asphalt, damaged pavement',
    catWater: 'Water Supply',
    catWaterDesc: 'Contamination, pipeline leakage, low pressure',
    catSchool: 'Govt Schools',
    catSchoolDesc: 'Classrooms, drinking water, meals, fans',
    catElectric: 'Street Lighting',
    catElectricDesc: 'Dark poles, flickering lights, exposed wire',
    catSanitation: 'Sanitation & Waste',
    catSanitationDesc: 'Garbage pileup, blocked drains, fumigation',

    // Statuses
    statusSubmitted: 'Submitted',
    statusUnderReview: 'Under Review',
    statusInProgress: 'In Progress',
    statusCompleted: 'Completed',
    statusRejected: 'Rejected',

    // Hall Booking
    hallTitle: 'Ward 14 Community Vivah Bhavan & Marriage Hall',
    hallSubtitle: 'Subsidized community marriage hall for ward residents equipped with central air-conditioning, generator backup, dedicated bride/groom green rooms, and ample parking.',
    freeDates: 'Free Dates (Available)',
    bookedDates: 'Booked Dates',
    underReviewDates: 'Under Review',
    residentRate: 'Resident Subsidized Rate: ₹12,000 / Day',

    // Medicine & Ration
    medTab: 'Free Medicine & Primary Health Center (PHC)',
    rationTab: 'Free Ration Scheme & Fair Price Shop (FPS)',
    operatingHours: 'Operating Sessions & Distribution Timings',
    essentialMeds: 'Essential Medicines Stock (100% Free of Charge)',
    fpsTitle: 'Fair Price Shop (FPS) Depot No. 412',
    tokenSchedule: 'Crowd-Free Token Schedule (By Last Digit of Ration Card)',

    // Common Buttons
    btnSubmit: 'Submit',
    btnClose: 'Close',
    btnCancel: 'Cancel',
    btnSearch: 'Search',
    btnBack: 'Back',
    bulletin: 'Bulletin:'
  },
  hi: {
    // Utility Bar & Header
    wardTitle: 'वार्ड संख्या 14 • केंद्रीय नगर निगम',
    officeHours: 'कार्यालय समय: सोम–शनि सुबह 9:00 से शाम 5:30 बजे',
    tollFree: 'टोल-फ्री हेल्पलाइन:',
    emergencyJal: 'आपातकालीन जल / बिजली कंट्रोल रूम:',
    subTitle: 'वार्ड नागरिक सेवा एवं शिकायत निवारण पोर्टल',

    // Nav
    navHome: 'मुख्य पृष्ठ',
    navFileComplaint: 'शिकायत दर्ज करें',
    navTrackStatus: 'स्थिति जांचें',
    navGovtSchemes: 'सरकारी योजनाएं',
    navMarriageHall: 'सामुदायिक विवाह भवन',
    navMedicineRation: 'निःशुल्क दवा व राशन',
    navRepLogin: 'पार्षद लॉगिन',
    navRepPanel: 'पार्षद प्रशासनिक कक्ष',
    logout: 'लॉगआउट',

    // Hero
    heroBadge: 'वार्ड नं. 14 नागरिक निवारण पोर्टल',
    heroSubBadge: 'स्थानीय सुशासन डेस्क',
    heroHeading: 'वार्ड में सड़क, पेयजल एवं सरकारी स्कूलों की समस्याओं का त्वरित समाधान',
    heroDescription: 'अपने वार्ड पार्षद के समक्ष सीधे शिकायत दर्ज करें, लाइव प्रगति जांचें, सरकारी योजनाओं की संपूर्ण जानकारी व आवेदन के चरण देखें, विवाह भवन की रिक्त तिथियां जांचें और निःशुल्क दवा व राशन वितरण समय सारणी देखें।',
    trackPlaceholder: 'ट्रैकिंग आईडी दर्ज करें (जैसे ARV-2026-1042) या फोन नंबर',
    btnTrackStatus: 'स्थिति जांचें',
    slaBadge: 'निगम सेवा गारंटी: 48–72 घंटे',
    servicesBadge: 'सड़कें • पेयजल • सरकारी स्कूल • स्ट्रीट लाइट',

    // Hero 4 Action Pillars
    cardGrievanceTitle: 'शिकायत दर्ज करें',
    cardGrievanceDesc: 'सड़क के गड्ढे, गंदे पानी की आपूर्ति, या सरकारी स्कूल की समस्याओं की शिकायत करें।',
    cardGrievanceBtn: 'शिकायत भेजें',
    cardSchemesTitle: 'जनकल्याणकारी योजनाएं',
    cardSchemesDesc: 'पात्रता सूची, आवश्यक दस्तावेज और आवेदन करने के चरण देखें।',
    cardSchemesBtn: 'योजनाएं देखें',
    cardHallTitle: 'सामुदायिक विवाह भवन',
    cardHallDesc: 'माहवार कैलेंडर पर रिक्त व आरक्षित तिथियां देखकर स्लॉट बुक करें।',
    cardHallBtn: 'कैलेंडर देखें',
    cardMedRationTitle: 'मुफ्त दवा व राशन',
    cardMedRationDesc: 'प्राथमिक स्वास्थ्य केंद्र के समय, दवा सूची व राशन दुकान की समय-सारणी।',
    cardMedRationBtn: 'समय सारणी देखें',

    // Stats
    statResolutionRate: 'निवारण दर (संतुष्टि)',
    statRedressed: 'निस्तारित शिकायतें',
    statActiveSchemes: 'सक्रिय सरकारी योजनाएं',
    statFreeBenefit: 'मुफ्त दवा व अनाज योजना',

    // Representative Card
    repName: 'श्री राजेश्वर वर्मा',
    repDesignation: 'वार्ड पार्षद / निर्वाचित जन प्रतिनिधि',
    repQuote: '"वार्ड 14 के प्रत्येक नागरिक को त्वरित शिकायत निवारण, गुणवत्तापूर्ण सरकारी स्कूल, स्वच्छ पेयजल एवं विकास कार्यों में पूर्ण पारदर्शिता उपलब्ध कराने के लिए सदैव समर्पित।"',
    repDirectOffice: 'सीधा कार्यालय फोन:',
    repSabhaTimings: 'जनता दर्शन / सभा:',
    repSabhaValue: 'प्रत्येक मंगल व गुरुवार (सुबह 10 से दोपहर 1 बजे)',
    repOfficeLoc: 'कार्यालय पता:',
    repOfficeValue: 'सामुदायिक भवन परिसर, सेक्टर 2',

    // Grievance Categories
    catRoad: 'सड़कें एवं गड्ढे',
    catRoadDesc: 'टूटी सड़क, गड्ढे, खुला फुटपाथ, नाली खुदाई',
    catWater: 'पेयजल आपूर्ति',
    catWaterDesc: 'गंदा पानी, पाइपलाइन लीकेज, पानी का कम दबाव',
    catSchool: 'सरकारी स्कूल व आंगनवाड़ी',
    catSchoolDesc: 'कक्षा के पंखे, पीने का पानी, मिड-डे मील, चारदीवारी',
    catElectric: 'स्ट्रीट लाइट एवं बिजली',
    catElectricDesc: 'बंद खंभे, लटकते तार, जलती-बुझती लाइट',
    catSanitation: 'स्वच्छता एवं कूड़ा निस्तारण',
    catSanitationDesc: 'कूड़े का ढेर, खुली नालियां, फॉगिंग एवं कीटनाशक छिड़काव',

    // Statuses
    statusSubmitted: 'प्राप्त (दर्ज)',
    statusUnderReview: 'समीक्षाधीन (अधिकारी आवंटित)',
    statusInProgress: 'प्रगति पर (कार्य चालू)',
    statusCompleted: 'निस्तारित (सफलतापूर्वक पूर्ण)',
    statusRejected: 'अस्वीकृत',

    // Hall Booking
    hallTitle: 'वार्ड 14 सामुदायिक एवं विवाह भवन',
    hallSubtitle: 'वार्ड निवासियों के लिए रियायती दर पर उपलब्ध विवाह भवन। केंद्रीय वातानुकूलन (AC), 24 घंटे जनरेटर बैकअप, वर-वधू सुइट रूम एवं विशाल पार्किंग सुविधा।',
    freeDates: 'रिक्त तिथियां (उपलब्ध)',
    bookedDates: 'आरक्षित तिथियां',
    underReviewDates: 'प्रक्रियाधीन',
    residentRate: 'वार्ड निवासी रियायती शुल्क: ₹12,000 / दिन',

    // Medicine & Ration
    medTab: 'निःशुल्क दवा एवं प्राथमिक स्वास्थ्य केंद्र (PHC)',
    rationTab: 'निःशुल्क राशन योजना एवं उचित दर दुकान (FPS)',
    operatingHours: 'साप्ताहिक ओपीडी एवं दवा वितरण सत्र',
    essentialMeds: 'उपलब्ध आवश्यक जेनेरिक दवाएं (100% निःशुल्क)',
    fpsTitle: 'उचित दर सरकारी राशन दुकान (डिपो नं. 412)',
    tokenSchedule: 'भीड़-मुक्त टोकन समय सारणी (राशन कार्ड के अंतिम अंक अनुसार)',

    // Common Buttons
    btnSubmit: 'जमा करें',
    btnClose: 'बंद करें',
    btnCancel: 'रद्द करें',
    btnSearch: 'खोजें',
    btnBack: 'वापस जाएं',
    bulletin: 'ताजा बुलेटिन:'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('arvix_language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('arvix_language', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  const t = (key) => {
    const langDict = translations[language] || translations['en'];
    return langDict[key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
