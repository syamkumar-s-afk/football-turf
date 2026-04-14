import React from 'react';
import { ShowerHead, MapPin, Lightbulb } from 'lucide-react';

const Amenity = ({ icon: Icon, title, desc }) => (
  <div className="glass" style={{ textAlign: 'center', padding: '32px 24px', borderRadius: '24px', flex: '1 1 250px' }}>
    <div style={{ 
      width: '72px', 
      height: '72px', 
      background: 'rgba(0, 210, 106, 0.1)', 
      borderRadius: '24px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      margin: '0 auto 24px',
      color: 'var(--primary)',
      transform: 'rotate(-5deg)'
    }}>
      <Icon size={32} />
    </div>
    <h4 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '12px' }}>{title}</h4>
    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>{desc}</p>
  </div>
);

const Amenities = () => {
  return (
    <section id="amenities" style={{ padding: '80px 0', background: 'var(--bg-dark)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span style={{ color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.75rem' }}>World-Class Facilities</span>
          <h2 style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', fontWeight: 800, marginTop: '12px' }}>Everything You Need</h2>
        </div>
        <div className="flex-stack" style={{ flexWrap: 'wrap', gap: '24px' }}>
          <Amenity icon={ShowerHead} title="Luxury Showers" desc="Private locker rooms with heated showers and fresh towels provided." />
          <Amenity icon={MapPin} title="Secure Parking" desc="Designated underground parking for all players, free for 3 hours." />
          <Amenity icon={Lightbulb} title="Pro Floodlayers" desc="Broadcast-standard lighting system for perfect visibility at night." />
        </div>
      </div>
    </section>
  );
};

export default Amenities;
