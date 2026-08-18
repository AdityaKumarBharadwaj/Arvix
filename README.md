# ARVIX — Ward Citizen Services & Grievance Redressal Portal

ARVIX is a hyper-local e-governance and community management portal built with the **MERN Stack** (MongoDB, Express, React, Node.js). Designed specifically for ward residents and ward representatives (Councilors / Corporators / Ward Officers), ARVIX facilitates transparent civic governance, seamless grievance resolution, and community facility access.

---

## 🏛️ Core Features

- **Grievance Redressal (Complaints)**:
  - Categories: Road Damage & Potholes, Water Supply & Pipeline Leaks, Government School Infrastructure, Sanitation & Waste Management, Streetlight & Electricity.
  - Photo attachment, exact landmark details, and automatic unique Tracking ID (`ARV-2024-XXXX`).
  - Live 4-stage tracking timeline (`Submitted` → `Under Review` → `In Progress` → `Completed` / `Rejected`).
  - Ward Representative administrative control to review, assign, add resolution notes, and update statuses.

- **Government Schemes Directory**:
  - Detailed explanations of national and state public welfare schemes (Education, Healthcare, Housing, Women & Child, Senior Citizens, Ration).
  - Breakdown of benefits, eligibility criteria checklist, required documentation, and step-by-step application instructions (Online & Ward Office counters).

- **Hero Banner, Announcements & Ward Functions**:
  - Urgent alerts ticker (scheduled power/water maintenance, health advisories).
  - Ward Representative contact card and ward helpline details.
  - Public functions calendar (cultural events, cleanliness drives, public consultations).

- **Community & Vivah (Marriage) Hall Booking**:
  - Interactive month-view calendar highlighting **Booked Dates** (Red) vs. **Free / Available Dates** (Green).
  - Resident booking request form with event details and automated validation.
  - Ward Representative approval workflow.

- **Free Medicine Distribution Schedule**:
  - Ward Primary Health Center (PHC) and municipal dispensary timings.
  - Searchable live inventory of essential medicines provided free of charge.
  - Notices for upcoming specialized health camps (eye checkups, diabetes screening, vaccinations).

- **Free Ration Scheme Timings & Fair Price Shop (FPS)**:
  - Operating hours and distribution windows for local Fair Price Shops.
  - Monthly grain & staple quotas for Antyodaya (AAY) and Priority Household (PHH/BPL) ration cards.
  - Token and card ending digit schedule to eliminate crowding.
  - Mandatory e-KYC guidelines and helpline information.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, React Router Dom, Axios
- **Backend**: Node.js, Express.js, MongoDB / Mongoose, JWT Authentication, Multer, bcryptjs, CORS
- **Architecture**: RESTful API with modular MVC structure

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (Local instance or MongoDB Atlas connection URI)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/arvix.git
   cd arvix
   ```
2. Install all dependencies (root, backend, and frontend):
   ```bash
   npm run install-all
   ```
3. Configure environment variables in `server/.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/arvix
   JWT_SECRET=arvix_civic_portal_secret_key_2024
   CLIENT_URL=http://localhost:5173
   ```
4. Seed sample data (schemes, medicines, ration schedule, sample complaints, and ward rep admin account):
   ```bash
   npm run seed
   ```
5. Start both servers concurrently:
   ```bash
   npm run dev
   ```
   - Client: `http://localhost:5173`
   - Server: `http://localhost:5000`

---

## 🔐 Default Admin Credentials
- **Email**: `representative@arvix.gov.in`
- **Password**: `WardRep@2024`
- **Role**: Ward Representative / Admin
