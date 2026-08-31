import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TopUtilityBar from './components/common/TopUtilityBar';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import ComplaintsPage from './pages/ComplaintsPage';
import SchemesPage from './pages/SchemesPage';
import HallBookingPage from './pages/HallBookingPage';
import MedicineAndRationPage from './pages/MedicineAndRationPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CitizenDashboardPage from './pages/CitizenDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <TopUtilityBar />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/complaints" element={<ComplaintsPage />} />
          <Route path="/complaints/track" element={<ComplaintsPage />} />
          <Route path="/schemes" element={<SchemesPage />} />
          <Route path="/hall-booking" element={<HallBookingPage />} />
          <Route path="/medicine-and-ration" element={<MedicineAndRationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/my-account" element={<CitizenDashboardPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
