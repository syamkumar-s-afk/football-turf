import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="glass" style={{
      position: 'fixed',
      top: 0,
      width: '100%',
      zIndex: 1000,
      padding: '20px 0'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link to="/" style={{ 
          color: 'var(--primary)', 
          fontSize: '1.8rem', 
          fontWeight: 800, 
          textDecoration: 'none',
          fontFamily: 'Outfit'
        }}>
          TurfPass
        </Link>

        <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
          <a href="#pitch" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500 }}>The Pitch</a>
          <a href="#amenities" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500 }}>Amenities</a>
          <a href="#location" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500 }}>Location</a>
          <a href="#booking" className="btn btn-primary">Book Now</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
