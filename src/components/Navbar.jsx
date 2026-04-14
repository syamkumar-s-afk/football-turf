import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setIsMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      document.body.classList.add('mobile-nav-active');
    } else {
      document.body.classList.remove('mobile-nav-active');
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.classList.remove('mobile-nav-active');
  };

  return (
    <nav className="glass" style={{
      position: 'fixed',
      top: 0,
      width: '100%',
      zIndex: 2000,
      padding: '15px 0',
      borderBottom: '1px solid rgba(255,255,255,0.05)'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link to="/" onClick={closeMenu} style={{ 
          color: 'var(--primary)', 
          fontSize: '1.8rem', 
          fontWeight: 800, 
          textDecoration: 'none',
          fontFamily: 'Outfit',
          zIndex: 2101
        }}>
          TurfPass
        </Link>

        {/* Desktop Menu */}
        <div className="nav-desktop" style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
          <a href="#pitch" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500 }}>The Pitch</a>
          <a href="#amenities" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500 }}>Amenities</a>
          <a href="#location" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500 }}>Location</a>
          <a href="#booking" className="btn btn-primary">Book Now</a>
        </div>

        {/* Mobile Toggle */}
        <button 
          onClick={toggleMenu}
          style={{ 
            display: 'none', 
            background: 'none', 
            color: '#fff',
            zIndex: 2101
          }} 
          className="nav-mobile-toggle"
        >
          {isMenuOpen ? <X size={30} /> : <Menu size={30} />}
        </button>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="mobile-nav-drawer">
            <a href="#pitch" onClick={closeMenu} style={{ color: '#fff', fontSize: '2rem', textDecoration: 'none', fontWeight: 800 }}>The Pitch</a>
            <a href="#amenities" onClick={closeMenu} style={{ color: '#fff', fontSize: '2rem', textDecoration: 'none', fontWeight: 800 }}>Amenities</a>
            <a href="#location" onClick={closeMenu} style={{ color: '#fff', fontSize: '2rem', textDecoration: 'none', fontWeight: 800 }}>Location</a>
            <a href="#booking" onClick={closeMenu} className="btn btn-primary" style={{ fontSize: '1.5rem', padding: '16px 48px', width: 'auto' }}>Book Now</a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
