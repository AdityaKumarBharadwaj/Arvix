const bcrypt = require('bcryptjs');
const { inMemoryStore } = require('../store/inMemoryStore');
const { getIsConnected } = require('../config/db');
const User = require('../models/User');
const Complaint = require('../models/Complaint');
const Scheme = require('../models/Scheme');
const HallBooking = require('../models/HallBooking');
const Announcement = require('../models/Announcement');

const seedSchemes = [
  {
    title: 'Pradhan Mantri Awas Yojana (Urban 2.0)',
    slug: 'pm-awas-yojana-urban',
    category: 'Housing',
    department: 'Ministry of Housing & Urban Poverty Alleviation',
    badge: 'Up to ₹2.67 Lakh Subsidy',
    shortDescription: 'Financial interest subsidy and direct grant for pucca house construction or renovation for EWS and LIG ward families.',
    fullDescription: 'PMAY-Urban provides pucca houses with basic civic amenities (water connection, electricity, sanitation) to all eligible urban households. Under the Credit Linked Subsidy Scheme (CLSS), beneficiaries receive upfront interest subsidy on home loans.',
    benefits: [
      'Upfront interest subsidy of 6.5% on housing loans up to ₹6 Lakh for EWS/LIG category.',
      'Direct central grant of ₹1.5 Lakh for beneficiary-led individual house construction.',
      'Mandatory female co-ownership of the newly constructed house.',
      'Free underground sewage and piped drinking water connection upon completion.'
    ],
    eligibility: [
      'Beneficiary family must not own a pucca house in any part of India.',
      'Annual household income up to ₹3,000,000 for EWS, and up to ₹6,000,000 for LIG.',
      'Resident of Ward 14 municipal boundary for minimum 3 years.',
      'Valid Aadhaar card linked with bank account.'
    ],
    documentsRequired: [
      'Aadhaar Card of all family members',
      'Income Certificate certified by Tehsildar / Ward Revenue Inspector',
      'Proof of Residence (Voter ID, Electricity Bill, or Ward Resident Card)',
      'Land ownership registry or No-Objection Certificate (NOC)',
      'Bank Account Passbook (first page with IFSC code)',
      'Affidavit of not owning a pucca house in India'
    ],
    applicationSteps: [
      { stepNumber: 1, stepTitle: 'Aadhaar Verification', instructions: 'Visit pmaymis.gov.in or Ward Helpdesk Counter No. 3 and verify Aadhaar biometric details.' },
      { stepNumber: 2, stepTitle: 'Fill Urban E-Application Form', instructions: 'Enter household income details, current living situation, and bank account particulars.' },
      { stepNumber: 3, stepTitle: 'Upload Documents & Ward Verification', instructions: 'Submit attested copies of income and residence proofs. Ward surveyor will conduct geo-tagging.' },
      { stepNumber: 4, stepTitle: 'Sanction Letter Issuance', instructions: 'Municipal commissioner issues subsidy sanction order directly into beneficiary bank account in 3 milestones.' }
    ],
    officialPortalUrl: 'https://pmaymis.gov.in',
    offlineLocation: 'Ward Urban Housing Desk, Room 4, Municipal Corporation Building'
  },
  {
    title: 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (AB-PMJAY)',
    slug: 'ayushman-bharat-pmjay',
    category: 'Healthcare',
    department: 'National Health Authority (NHA)',
    badge: '₹5,00,000 Free Hospital Cover',
    shortDescription: 'World’s largest cashless health assurance scheme offering up to ₹5 Lakh per family per year for secondary and tertiary care hospitalizations.',
    fullDescription: 'Ayushman Bharat PM-JAY covers over 1,900 surgical, medical, and daycare procedures. It includes pre-hospitalization tests (up to 3 days) and post-hospitalization medicines (up to 15 days) across all empaneled public and private hospitals nationwide.',
    benefits: [
      'Cashless & paperless access to treatment at empaneled government & private hospitals.',
      'Coverage of up to ₹5,00,000 per family per year on family floater basis.',
      'No restriction on family size, age, or gender.',
      'All pre-existing medical conditions covered from Day 1 of card issuance.'
    ],
    eligibility: [
      'Families identified under SECC 2011 deprivation criteria or active BPL / Antyodaya ration card holders.',
      'All senior citizens aged 70 years and above irrespective of income bracket (Universal Senior Cover).',
      'Ward 14 residents registered under state health mission registries.'
    ],
    documentsRequired: [
      'Aadhaar Card with mobile linking',
      'Active Ration Card (Pink, Yellow, or NFSA card)',
      'Mobile phone for instantaneous OTP generation'
    ],
    applicationSteps: [
      { stepNumber: 1, stepTitle: 'Check Eligibility', instructions: 'Check your family name on beneficiary.nha.gov.in or present your Ration Card at Ward Health Center.' },
      { stepNumber: 2, stepTitle: 'E-KYC at Ward CSC Counter', instructions: 'Complete Aadhaar Face Authentication or Iris/Thumbprint scan at Ward e-Mitra / CSC kiosk.' },
      { stepNumber: 3, stepTitle: 'Download Plastic Golden Card', instructions: 'Instant PVC Ayushman Card generated with permanent ABHA Health ID.' }
    ],
    officialPortalUrl: 'https://beneficiary.nha.gov.in',
    offlineLocation: 'Primary Health Center (PHC) Ayushman Desk & Ward CSC Kiosk'
  },
  {
    title: 'Ward Government School Free Uniform, Textbooks & Nutrition Scheme',
    slug: 'govt-school-free-books-uniform-scheme',
    category: 'Education',
    department: 'Department of School Education & Literacy',
    badge: '100% Free School Kits & Meals',
    shortDescription: 'Free seasonal uniform sets, NCERT textbook kits, stationery, and daily fortified mid-day meals for all students enrolled in ward government schools.',
    fullDescription: 'Targeted at ensuring zero student dropout and eliminating malnutrition in primary and upper-primary ward municipal schools. Every child from Class 1 to Class 8 receives two stitched uniform sets, free textbooks, school bag, and fortified hot meals daily.',
    benefits: [
      'Two complete pairs of school uniform + winter sweater / blazer provided annually.',
      'Complete set of curriculum textbooks, notebooks, and geometry stationery kits.',
      'Daily fortified lunch under PM POSHAN (Mid-Day Meal) with seasonal fruit and milk twice a week.',
      'Free bi-annual pediatric health checkup and deworming tablets at school premises.'
    ],
    eligibility: [
      'Any student enrolled in Ward 14 Government Primary School or Ward Girls Upper Primary School.',
      'No income bar or caste restriction; universal coverage for all admitted students (Classes 1–8).'
    ],
    documentsRequired: [
      'Student Birth Certificate or Hospital Discharge Summary',
      'Student Aadhaar Card (or parent Aadhaar if student card is under process)',
      'Ward Residence proof of parents',
      '2 passport-size photographs of student'
    ],
    applicationSteps: [
      { stepNumber: 1, stepTitle: 'Admission Enrollment', instructions: 'Enroll student at Ward Govt Primary School, Sector 2 between March and July.' },
      { stepNumber: 2, stepTitle: 'Automatic Kit Allocation', instructions: 'School Headmaster automatically enters student details in UDISE+ database.' },
      { stepNumber: 3, stepTitle: 'Kit Handover Ceremony', instructions: 'Uniforms, bags, and textbooks distributed on the opening week of the academic session.' }
    ],
    officialPortalUrl: 'https://dsel.education.gov.in',
    offlineLocation: 'Principal Office, Ward 14 Government Model Composite School'
  },
  {
    title: 'Pradhan Mantri Garib Kalyan Anna Yojana (Free Ration Scheme)',
    slug: 'pm-garib-kalyan-anna-yojana',
    category: 'Food & Ration',
    department: 'Department of Food & Public Distribution',
    badge: '100% Free Foodgrain',
    shortDescription: 'Free monthly distribution of fortified rice, wheat, and coarse grains to Antyodaya and Priority Household ration card holders.',
    fullDescription: 'PMGKAY ensures food security for all low-income ward families. Eliminates the token ₹2/₹3 fee, making basic food staples 100% free of charge through automated biometric e-PoS ration distribution shops.',
    benefits: [
      'Antyodaya Anna Yojana (AAY): 35 kg grain per family per month free.',
      'Priority Household (PHH): 5 kg grain per member per month free.',
      'One Nation One Ration Card (ONORC) portability across any Fair Price Shop in the city.',
      'Fortified rice with iron, folic acid, and vitamin B12 to eliminate anemia.'
    ],
    eligibility: [
      'Possession of active AAY (Yellow) or PHH (Pink/Blue) ration card.',
      'Cardholders who have completed mandatory biometric e-KYC.'
    ],
    documentsRequired: [
      'Original Digital Ration Card',
      'Aadhaar Card of any registered family member',
      'Mobile phone for emergency OTP fallback'
    ],
    applicationSteps: [
      { stepNumber: 1, stepTitle: 'Check Distribution Dates', instructions: 'Consult the Ward 14 FPS schedule based on your card ending digits.' },
      { stepNumber: 2, stepTitle: 'Visit Fair Price Shop 412', instructions: 'Present ration card to dealer Smt. Sunita Devi at Municipal Ration Complex.' },
      { stepNumber: 3, stepTitle: 'Biometric Scan & Receipt', instructions: 'Place thumb on e-PoS device. Collect grain and computerized weighing slip.' }
    ],
    officialPortalUrl: 'https://nfsa.gov.in',
    offlineLocation: 'Ward Fair Price Shop No. 412, Sector 3 Market'
  },
  {
    title: 'Sukanya Samriddhi Yojana (Girl Child Future Security)',
    slug: 'sukanya-samriddhi-yojana',
    category: 'Women & Child',
    department: 'Ministry of Women and Child Development',
    badge: '8.2% Guaranteed Interest',
    shortDescription: 'High-interest tax-exempt savings scheme for the girl child with triple tax exemption (EEE) under Section 80C.',
    fullDescription: 'SSY empowers parents of girl children to build a dedicated education and marriage fund. Accounts can be opened anytime from birth up to 10 years of age, offering superior interest rates backed by sovereign government guarantee.',
    benefits: [
      'Highest sovereign interest rate of 8.2% compounded annually.',
      'Complete Triple Tax Exemption (Exempt on deposit, Exempt on interest, Exempt on maturity).',
      'Flexible annual deposit from minimum ₹250 up to ₹1,50,000.',
      'Partial withdrawal allowed for higher college education after the girl child turns 18.'
    ],
    eligibility: [
      'Parents/guardians of girl children aged 10 years or below residing in the ward.',
      'Maximum 2 girl children per household (extended in case of twin girls).'
    ],
    documentsRequired: [
      'Birth Certificate of girl child',
      'Parent / Guardian Aadhaar Card & PAN Card',
      'Ward residential proof',
      'Initial deposit amount (minimum ₹250 in cash or cheque)'
    ],
    applicationSteps: [
      { stepNumber: 1, stepTitle: 'Fill Post Office Account Form', instructions: 'Collect Form-1 from Ward Sub-Post Office, Sector 2.' },
      { stepNumber: 2, stepTitle: 'Submit Identity & Birth Proofs', instructions: 'Attach attested copies of child birth certificate and parent Aadhaar.' },
      { stepNumber: 3, stepTitle: 'Passbook Issuance', instructions: 'Collect official Sukanya Samriddhi Passbook with account number within 24 hours.' }
    ],
    officialPortalUrl: 'https://www.indiapost.gov.in',
    offlineLocation: 'Ward 14 Sub-Post Office Counter No. 1, Main Road'
  },
  {
    title: 'Indira Gandhi National Old Age Pension Scheme (IGNOAPS)',
    slug: 'national-old-age-pension',
    category: 'Senior Citizens',
    department: 'Ministry of Rural Development & Social Welfare',
    badge: 'Direct Monthly Pension',
    shortDescription: 'Monthly direct financial pension deposited directly into bank accounts of destitute and BPL senior citizens aged 60 and above.',
    fullDescription: 'Provides social security pension to elderly ward residents living below poverty line without active family support. Beneficiaries receive a monthly pension credited directly via DBT (Direct Benefit Transfer) on the 1st of every month.',
    benefits: [
      'Monthly direct bank credit of ₹1,000 – ₹1,500 (combined Central and State contribution).',
      'Zero balance bank account with free RuPay debit card and passbook.',
      'Free priority healthcare consultation at Ward Primary Health Center.',
      'Annual life certificate (Jeevan Pramaan) verification service available at home for bedridden seniors.'
    ],
    eligibility: [
      'Applicant age must be 60 years or above.',
      'Family must belong to BPL category as verified by Municipal Corporation / Tehsildar.',
      'Must have resided in Ward 14 for at least 5 years.'
    ],
    documentsRequired: [
      'Aadhaar Card or Voter ID (proof of age)',
      'BPL Ration Card / Income Certificate',
      'Single-name Bank Passbook linked with Aadhaar (DBT active)',
      '2 recent passport-size photographs'
    ],
    applicationSteps: [
      { stepNumber: 1, stepTitle: 'Application Submission', instructions: 'Submit Form-B at Ward Social Welfare Window with age and BPL proofs.' },
      { stepNumber: 2, stepTitle: 'Ward Inspector Verification', instructions: 'Field officer visits resident address to verify age and living conditions.' },
      { stepNumber: 3, stepTitle: 'Pension Book & DBT Activation', instructions: 'Pension sanctioned and monthly automated credit starts within 30 days.' }
    ],
    officialPortalUrl: 'https://nsap.nic.in',
    offlineLocation: 'Ward Social Welfare Office, Municipal Administrative Block'
  }
];

const seedBookings = [
  {
    hallName: 'Ward 14 Community Vivah Bhavan',
    applicantName: 'Suresh Chandra Sharma',
    applicantPhone: '9810234567',
    applicantEmail: 'suresh.sharma@example.com',
    applicantAddress: 'House 42, Gali No. 3, Sector 2, Ward 14',
    eventType: 'Marriage',
    date: '2024-09-08',
    guestCount: 650,
    idProofType: 'Aadhaar Card',
    idProofNumber: 'XXXX-XXXX-9821',
    status: 'Confirmed',
    adminRemark: 'Resident verified. Security deposit and subsidized booking fee paid in full.'
  },
  {
    hallName: 'Ward 14 Community Vivah Bhavan',
    applicantName: 'Mohd. Farhan Ansari',
    applicantPhone: '9871122334',
    applicantEmail: 'farhan.ansari@example.com',
    applicantAddress: 'Flat 104, Green Park Apartments, Ward 14',
    eventType: 'Reception',
    date: '2024-09-14',
    guestCount: 450,
    idProofType: 'Aadhaar Card',
    idProofNumber: 'XXXX-XXXX-4412',
    status: 'Confirmed',
    adminRemark: 'Approved for evening reception session.'
  },
  {
    hallName: 'Ward 14 Community Vivah Bhavan',
    applicantName: 'Dr. Rameshwar Patel',
    applicantPhone: '9412098765',
    applicantEmail: 'rpatel@example.com',
    applicantAddress: 'Plot 88, Shanti Nagar, Ward 14',
    eventType: 'Marriage',
    date: '2024-09-21',
    guestCount: 800,
    idProofType: 'Voter ID',
    idProofNumber: 'DL/14/09823',
    status: 'Confirmed',
    adminRemark: 'Confirmed for wedding ceremony and feast.'
  },
  {
    hallName: 'Ward 14 Community Vivah Bhavan',
    applicantName: 'Anita Kumari Jha',
    applicantPhone: '9899123456',
    applicantEmail: 'anita.jha@example.com',
    applicantAddress: 'House 12, Block B, Ward 14',
    eventType: 'Engagement',
    date: '2024-09-28',
    guestCount: 250,
    idProofType: 'Aadhaar Card',
    idProofNumber: 'XXXX-XXXX-1102',
    status: 'Pending',
    adminRemark: 'Under verification by ward staff.'
  }
];

const seedAnnouncements = [
  {
    title: 'Urgent: Water Supply Pipeline Maintenance & Valve Replacement in Sector 3 & 4',
    content: 'Jal Board engineers will carry out major pipeline valve replacements near Central Water Reservoir this Saturday from 9:30 AM to 3:30 PM. Residents are requested to store adequate drinking water. Water tanker delivery will be on standby via helpline: 1800-200-1414.',
    category: 'Emergency Alert',
    urgency: 'Urgent',
    eventDate: 'Saturday, 9:30 AM – 3:30 PM',
    isPinned: true
  },
  {
    title: 'Ward Open Sabha (Citizen-Councilor Public Forum) on Pothole Repairs & Monsoon Drainage',
    content: 'Ward Councilor Shri Rajeshwar Verma invites all residents, Resident Welfare Associations (RWAs), and market traders for the monthly Ward Open Sabha to review road resurfacing progress and drainage clearing.',
    category: 'Ward Function',
    urgency: 'Important',
    eventDate: 'Coming Sunday at 10:30 AM',
    isPinned: true
  },
  {
    title: 'Free Ayushman Card & Aadhaar e-KYC Special Desk at Ward Community Hall',
    content: 'Special 3-day doorstep registration camp for senior citizens (70+ years) and BPL families to generate PVC Golden Health Cards. Bring original Aadhaar Card and Ration Card. Spot issuance within 10 minutes.',
    category: 'Health Camp',
    urgency: 'Normal',
    eventDate: 'Mon to Wed, 10:00 AM – 4:00 PM',
    isPinned: false
  }
];

const seedComplaints = [
  {
    trackingId: 'ARV-2024-1042',
    citizenName: 'Manoj Kumar Sharma',
    citizenPhone: '9810145678',
    citizenEmail: 'manoj.sharma@example.com',
    category: 'Road',
    title: 'Deep potholes and broken asphalt on Sector 3 Main Market Road',
    description: 'Multiple deep potholes right in front of Shop No. 15 to 22. Two-wheelers frequently slip during evening traffic. Rainwater stagnation is worsening the craters.',
    landmark: 'Opposite State Bank ATM, Sector 3 Market Road',
    wardNumber: 14,
    priority: 'High',
    photos: [],
    status: 'In Progress',
    assignedDepartment: 'Municipal Roads & Highway Dept',
    adminRemark: 'Contractor issued notice. Patchwork machinery and hot-mix asphalt scheduled for deployment tomorrow evening.',
    statusHistory: [
      { status: 'Submitted', timestamp: new Date('2024-08-14T09:30:00'), note: 'Complaint registered by citizen with landmark photos.', updatedBy: 'Citizen Portal' },
      { status: 'Under Review', timestamp: new Date('2024-08-15T11:00:00'), note: 'Ward junior engineer inspected the site and verified road crater dimensions.', updatedBy: 'Shri Rajeshwar Verma (Ward Councilor)' },
      { status: 'In Progress', timestamp: new Date('2024-08-17T14:20:00'), note: 'Road repair work-order #RW-412 issued to municipal contractor.', updatedBy: 'Ward Representative Office' }
    ],
    createdAt: new Date('2024-08-14T09:30:00')
  },
  {
    trackingId: 'ARV-2024-1088',
    citizenName: 'Pooja Verma',
    citizenPhone: '9873210987',
    citizenEmail: 'pooja.v@example.com',
    category: 'Water',
    title: 'Severely contaminated muddy water supply in Block B residential lane',
    description: 'For the last 3 days, morning tap water supply (6 AM to 8 AM) has foul odor and brownish mud residue. High risk of waterborne illnesses for children.',
    landmark: 'Lane 4, Near Children Park, Block B',
    wardNumber: 14,
    priority: 'Urgent',
    photos: [],
    status: 'Completed',
    assignedDepartment: 'Jal Board & Sanitation',
    adminRemark: 'Underground pipeline joint leakage near sewer cross line successfully repaired and pipeline flushed with chlorine solution. Water tested clear.',
    statusHistory: [
      { status: 'Submitted', timestamp: new Date('2024-08-12T07:15:00'), note: 'Urgent water contamination alert lodged.', updatedBy: 'Citizen Portal' },
      { status: 'Under Review', timestamp: new Date('2024-08-12T08:45:00'), note: 'Jal board emergency testing team deployed to collect water samples.', updatedBy: 'Ward Representative Office' },
      { status: 'In Progress', timestamp: new Date('2024-08-13T10:00:00'), note: 'Pipeline excavation commenced to fix cracked PVC line.', updatedBy: 'Jal Board Team' },
      { status: 'Completed', timestamp: new Date('2024-08-14T16:00:00'), note: 'Pipeline sealed and clean water supply restored. Verified by RWA president.', updatedBy: 'Shri Rajeshwar Verma (Ward Councilor)' }
    ],
    resolvedAt: new Date('2024-08-14T16:00:00'),
    createdAt: new Date('2024-08-12T07:15:00')
  },
  {
    trackingId: 'ARV-2024-1120',
    citizenName: 'Devendra Nath',
    citizenPhone: '9891002233',
    citizenEmail: 'd.nath@example.com',
    category: 'Government School',
    title: 'Broken boundary wall and dysfunctional ceiling fans in Ward Govt Primary School',
    description: 'Class 3 and Class 4 rooms have non-working ceiling fans causing immense heat distress to students. Boundary wall on the rear ground has collapsed, posing safety concerns.',
    landmark: 'Ward 14 Government Primary School, Near Post Office',
    wardNumber: 14,
    priority: 'High',
    photos: [],
    status: 'Under Review',
    assignedDepartment: 'Ward Education & Anganwadi Board',
    adminRemark: 'Site inspection completed with school principal. Estimate of ₹45,000 sanctioned under Ward Discretionary Maintenance Fund.',
    statusHistory: [
      { status: 'Submitted', timestamp: new Date('2024-08-18T10:00:00'), note: 'Citizen grievance filed regarding school infrastructure.', updatedBy: 'Citizen Portal' },
      { status: 'Under Review', timestamp: new Date('2024-08-19T12:30:00'), note: 'Ward Councilor personal visit conducted with municipal school inspector.', updatedBy: 'Shri Rajeshwar Verma (Ward Councilor)' }
    ],
    createdAt: new Date('2024-08-18T10:00:00')
  },
  {
    trackingId: 'ARV-2024-1155',
    citizenName: 'Sunil Sakhuja',
    citizenPhone: '9818833445',
    citizenEmail: 'sunil.sakhuja@example.com',
    category: 'Electricity',
    title: 'Streetlights continuously flickering and 4 dark poles on Temple Road',
    description: 'Four street lighting poles (Pole #ST-14-11 to ST-14-14) have been dead for one week. The dark stretch makes it unsafe for women and evening commuters.',
    landmark: 'Between Shiv Mandir and Community Park Gate 2',
    wardNumber: 14,
    priority: 'Routine',
    photos: [],
    status: 'Submitted',
    assignedDepartment: 'State Electricity Distribution',
    adminRemark: '',
    statusHistory: [
      { status: 'Submitted', timestamp: new Date('2024-08-20T19:00:00'), note: 'Grievance submitted. Assigned to electrical maintenance lineman.', updatedBy: 'Citizen Portal' }
    ],
    createdAt: new Date('2024-08-20T19:00:00')
  }
];

const seedInitialData = async () => {
  try {
    // Populate inMemoryStore
    inMemoryStore.schemes = [...seedSchemes];
    inMemoryStore.hallBookings = [...seedBookings];
    inMemoryStore.announcements = [...seedAnnouncements];
    inMemoryStore.complaints = [...seedComplaints];

    // If MongoDB is connected, populate database collections if empty
    if (getIsConnected()) {
      const schemeCount = await Scheme.countDocuments();
      if (schemeCount === 0) {
        await Scheme.insertMany(seedSchemes);
        console.log('[Seed] Populated MongoDB Schemes collection.');
      }

      const bookingCount = await HallBooking.countDocuments();
      if (bookingCount === 0) {
        await HallBooking.insertMany(seedBookings);
        console.log('[Seed] Populated MongoDB HallBookings collection.');
      }

      const announcementCount = await Announcement.countDocuments();
      if (announcementCount === 0) {
        await Announcement.insertMany(seedAnnouncements);
        console.log('[Seed] Populated MongoDB Announcements collection.');
      }

      const complaintCount = await Complaint.countDocuments();
      if (complaintCount === 0) {
        await Complaint.insertMany(seedComplaints);
        console.log('[Seed] Populated MongoDB Complaints collection.');
      }

      const adminUser = await User.findOne({ email: 'representative@arvix.gov.in' });
      if (!adminUser) {
        await User.create({
          name: 'Shri Rajeshwar Verma',
          email: 'representative@arvix.gov.in',
          phone: '9876543210',
          password: 'WardRep@2024',
          role: 'representative',
          designation: 'Ward Councilor / Representative',
          wardNumber: 14
        });
        console.log('[Seed] Created default Ward Representative Admin user in MongoDB.');
      }
    }
  } catch (error) {
    console.warn('[Seed Warning]:', error.message);
  }
};

module.exports = { seedInitialData };
