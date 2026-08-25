import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TopUtilityBar from './components/common/TopUtilityBar';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <TopUtilityBar />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
