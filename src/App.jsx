import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import Experience from './sections/Experience';
import Booking from './sections/Booking';
import Amenities from './sections/Amenities';
import Testimonials from './sections/Testimonials';
import Location from './sections/Location';
import Footer from './components/Footer';
import Admin from './pages/Admin';
import Login from './pages/Login';
import './index.css';

function Home() {
  return (
    <>
      <Hero />
      <Experience />
      <Booking />
      <Amenities />
      <Testimonials />
      <Location />
    </>
  );
}

function App() {
  const [adminPass, setAdminPass] = useState(localStorage.getItem('admin_pass') || '');

  const handleLogin = (pass) => {
    localStorage.setItem('admin_pass', pass);
    setAdminPass(pass);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_pass');
    setAdminPass('');
  };

  return (
    <Router>
      <div className="app">
        {!adminPass && <Navbar />}
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/admin.com" 
              element={
                adminPass ? 
                <Admin adminPass={adminPass} onLogout={handleLogout} /> : 
                <Login onLogin={handleLogin} />
              } 
            />
          </Routes>
        </main>
        {!adminPass && <Footer />}
      </div>
    </Router>
  );
}

export default App;
