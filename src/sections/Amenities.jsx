import React from 'react';
import { ShowerHead, MapPin, Lightbulb } from 'lucide-react';

const Amenity = ({ icon: Icon, title, desc }) => (
  <div style={{ textAlign: 'center', flex: 1 }}>
    <div style={{ 
      width: '80px', 
      height: '80px', 
      background: 'rgba(255,255,255,0.05)', 
      borderRadius: '50%', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      margin: '0 auto 20px',
      color: 'var(--primary)'
    }}>
      <Icon size={32} />
    </div>
    <h4 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '10px' }}>{title}</h4>
    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{desc}</p>
  </div>
);

const Amenities = () => {
  return (
    <section id="amenities" style={{ padding: '100px 0', background: 'var(--bg-dark)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span style={{ color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem' }}>World-Class Facilities</span>
          <h2 style={{ fontSize: '3rem', fontWeight: 800, marginTop: '10px' }}>Everything You Need</h2>
        </div>
        <div style={{ display: 'flex', gap: '40px' }}>
          <Amenity icon={ShowerHead} title="Luxury Showers" desc="Private locker rooms with heated showers and fresh towels." />
          <Amenity icon={MapPin} title="Secure Parking" desc="Designated underground parking for all players, free for 3 hours." />
          <Amenity icon={Lightbulb} title="Pro Floodlayers" desc="Broadcast-standard lighting system for perfect visibility at night." />
        </div>
      </div>
    </section>
  );
};

export default Amenities;
