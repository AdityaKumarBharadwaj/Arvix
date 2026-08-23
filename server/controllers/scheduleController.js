const { inMemoryStore } = require('../store/inMemoryStore');

// Default authentic medicine distribution schedule
const defaultMedicineData = {
  facilityName: 'Ward No. 14 Urban Primary Health Center & Dispensary',
  address: 'Near Ward Office Complex, Main Market Road, Sector 2',
  medicalOfficer: 'Dr. Anita Deshmukh, MBBS (General Physician)',
  contactPhone: '011-2874-9044 / +91 94123-88901',
  operatingSchedule: [
    { dayRange: 'Monday to Saturday (Morning Session)', hours: '8:30 AM – 1:30 PM', service: 'OPD Consultation, Free Generic Medicine Dispensing & Vital Checks' },
    { dayRange: 'Monday to Friday (Evening Clinic)', hours: '4:30 PM – 7:00 PM', service: 'Emergency Follow-ups & Chronic Medication Refill (Diabetes / Hypertension)' },
    { dayRange: 'Sunday & Public Gazetted Holidays', hours: '9:00 AM – 12:00 PM', service: 'Emergency First-Aid and Urgent Pharmacy Counter Only' }
  ],
  guidelines: [
    'Valid Government Photo ID (Aadhaar or Voter ID) or Ward Resident Slip required.',
    'Doctor prescription required for antibiotics and chronic condition medicines (valid for 30 days).',
    'Senior Citizens (60+) and Pregnant Mothers have priority green lane access.'
  ],
  availableMedicines: [
    { name: 'Paracetamol Tablets IP (500mg)', category: 'Analgesic & Antipyretic', stockStatus: 'In Stock', dosageNotes: 'For fever and mild to moderate pain relief' },
    { name: 'Metformin Hydrochloride (500mg)', category: 'Anti-Diabetic', stockStatus: 'In Stock', dosageNotes: 'Monthly quota with valid prescription & blood sugar log' },
    { name: 'Amlodipine Tablets IP (5mg)', category: 'Hypertension / BP', stockStatus: 'In Stock', dosageNotes: 'Monthly refill for registered hypertensive patients' },
    { name: 'Oral Rehydration Salts (ORS IP 21.8g)', category: 'Electrolyte Replenisher', stockStatus: 'In Stock', dosageNotes: 'WHO formula for dehydration and diarrhea' },
    { name: 'Iron & Folic Acid Tablets (IFA)', category: 'Maternal Nutrition', stockStatus: 'In Stock', dosageNotes: 'Free for adolescent girls, pregnant & lactating mothers' },
    { name: 'Cetirizine Hydrochloride (10mg)', category: 'Antihistamine / Allergy', stockStatus: 'In Stock', dosageNotes: 'Allergic rhinitis and skin allergies' },
    { name: 'Amoxicillin Capsules IP (500mg)', category: 'Antibiotic', stockStatus: 'In Stock', dosageNotes: 'Strictly on MBBS Doctor prescription only' },
    { name: 'Antacid & Antiflatulent Oral Gel (200ml)', category: 'Gastrointestinal', stockStatus: 'In Stock', dosageNotes: 'For acid reflux and gastritis relief' },
    { name: 'Calcium & Vitamin D3 Tablets', category: 'Supplements', stockStatus: 'In Stock', dosageNotes: 'Bone health support for seniors and women' },
    { name: 'Albendazole Chewable (400mg)', category: 'Deworming', stockStatus: 'In Stock', dosageNotes: 'Biannual national deworming dose for children' }
  ],
  upcomingHealthCamps: [
    {
      title: 'Mega Senior Citizen Eye Screening & Free Spectacle Distribution',
      date: 'Second Saturday of the Month',
      timing: '9:30 AM – 3:30 PM',
      venue: 'Ward Community Hall, Sector 2',
      specialists: 'Ophthalmology Team from District Civil Hospital',
      services: 'Free cataract screening, intraocular pressure check, and free bifocal glasses for eligible seniors.'
    },
    {
      title: 'Maternal & Child Pulse Immunization Drive',
      date: 'Every Wednesday',
      timing: '9:00 AM – 1:00 PM',
      venue: 'Ward Primary Health Center Room No. 2',
      specialists: 'Pediatric Medical Officer & ANM Workers',
      services: 'Free BCG, Pentavalent, Rotavirus, MR vaccine doses and Vitamin A drops.'
    }
  ]
};

// Default authentic Fair Price Shop (FPS) ration distribution schedule
const defaultRationData = {
  fpsNumber: 'Fair Price Shop (FPS) Depot No. 412',
  dealerName: 'Smt. Sunita Devi (Authorized Ward Fair Price Dealer)',
  location: 'Shop No. 12-B, Municipal Ration Complex, Near Water Tank, Ward 14',
  contactPhone: '+91 98112-44530',
  monthlyDistributionPeriod: '1st to 20th of every calendar month',
  dailyTimings: {
    morningShift: '8:00 AM – 12:30 PM',
    eveningShift: '4:00 PM – 7:30 PM',
    weeklyOff: 'Tuesday (Weekly Stock Reconciliation Day)'
  },
  cardTiers: [
    {
      cardType: 'Antyodaya Anna Yojana (AAY - Yellow Card)',
      eligibility: 'Poorest of poor families & destitute households',
      quota: '35 kg grain per family per month (20 kg Rice + 15 kg Wheat)',
      cost: '100% Free under PMGKAY (Central Food Security Scheme)'
    },
    {
      cardType: 'Priority Household (PHH / BPL - Pink / Blue Card)',
      eligibility: 'Below Poverty Line verified ward families',
      quota: '5 kg grain per registered member per month (3 kg Rice + 2 kg Wheat)',
      cost: '100% Free under PMGKAY'
    },
    {
      cardType: 'Non-Priority Household (NPHH / APL - White Card)',
      eligibility: 'General ward residents with valid ration card',
      quota: 'Subsidized Fortified Wheat Flour & Iodized Salt as per state allocation',
      cost: 'Subsidized rate: Wheat @ ₹2/kg, Rice @ ₹3/kg'
    }
  ],
  tokenSchedule: [
    { endingDigits: 'Ration cards ending in 0 or 1', allocatedDays: '1st to 4th of the month', shift: 'Morning & Evening' },
    { endingDigits: 'Ration cards ending in 2 or 3', allocatedDays: '5th to 8th of the month', shift: 'Morning & Evening' },
    { endingDigits: 'Ration cards ending in 4 or 5', allocatedDays: '9th to 12th of the month', shift: 'Morning & Evening' },
    { endingDigits: 'Ration cards ending in 6 or 7', allocatedDays: '13th to 16th of the month', shift: 'Morning & Evening' },
    { endingDigits: 'Ration cards ending in 8 or 9', allocatedDays: '17th to 20th of the month', shift: 'Morning & Evening' },
    { endingDigits: 'Remaining & Leftover Cardholders', allocatedDays: '21st to 23rd of the month', shift: 'Special Mop-up Window' }
  ],
  mandatoryInstructions: [
    'Biometric e-PoS (electronic Point of Sale) thumbprint authentication is required.',
    'If biometric fails after 3 tries, OTP authentication on Aadhaar-linked mobile is supported.',
    'Carry Original Ration Card and Aadhaar Card of any registered family member.',
    'Helpline for weighing discrepancies or dealer non-availability: Ward Inspector (011-2874-9011).'
  ]
};

// Initialize in-memory store with default schedules
inMemoryStore.setMedicineSchedule(defaultMedicineData);
inMemoryStore.setRationSchedule(defaultRationData);

// @desc    Get medicine distribution schedule
// @route   GET /api/schedules/medicine
// @access  Public
const getMedicineSchedule = async (req, res) => {
  try {
    const data = inMemoryStore.getMedicineSchedule() || defaultMedicineData;
    res.json({ success: true, medicineSchedule: data });
  } catch (error) {
    console.error('[Get Medicine Schedule Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update medicine distribution schedule
// @route   PUT /api/schedules/medicine
// @access  Private (Ward Representative / Admin)
const updateMedicineSchedule = async (req, res) => {
  try {
    const updated = inMemoryStore.setMedicineSchedule(req.body);
    res.json({ success: true, message: 'Medicine distribution schedule updated', medicineSchedule: updated });
  } catch (error) {
    console.error('[Update Medicine Schedule Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get free ration scheme distribution schedule
// @route   GET /api/schedules/ration
// @access  Public
const getRationSchedule = async (req, res) => {
  try {
    const data = inMemoryStore.getRationSchedule() || defaultRationData;
    res.json({ success: true, rationSchedule: data });
  } catch (error) {
    console.error('[Get Ration Schedule Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update free ration scheme distribution schedule
// @route   PUT /api/schedules/ration
// @access  Private (Ward Representative / Admin)
const updateRationSchedule = async (req, res) => {
  try {
    const updated = inMemoryStore.setRationSchedule(req.body);
    res.json({ success: true, message: 'Ration distribution schedule updated', rationSchedule: updated });
  } catch (error) {
    console.error('[Update Ration Schedule Error]:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMedicineSchedule,
  updateMedicineSchedule,
  getRationSchedule,
  updateRationSchedule,
  defaultMedicineData,
  defaultRationData
};
