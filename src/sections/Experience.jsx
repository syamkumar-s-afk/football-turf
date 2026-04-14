import React from 'react';

const FeatureCard = ({ title, subtitle }) => (
  <div style={{
    background: 'rgba(255,255,255,0.03)',
    padding: '30px',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.05)',
    flex: 1
  }}>
    <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--primary)' }}>{title}</h3>
    <p style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px', marginTop: '5px' }}>{subtitle}</p>
  </div>
);

const Experience = () => {
  return (
    <section id="pitch" style={{ padding: '100px 0', background: 'var(--bg-dark)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          <div>
            <span style={{ color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem' }}>The Experience</span>
            <h2 style={{ fontSize: '3.5rem', fontWeight: 800, margin: '20px 0' }}>Engineered for Peak Performance</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '40px' }}>
              Wembley Arena A isn't just a pitch, it's a sanctuary for the beautiful game. Built with the latest FIFA Pro standard synthetic fibers, it offers the perfect balance of grip and cushion, ensuring every sprint and close turn is professional.
            </p>
            <div style={{ display: 'flex', gap: '20px' }}>
              <FeatureCard title="FIFA Pro" subtitle="Turf Quality" />
              <FeatureCard title="70x50m" subtitle="Dimensions" />
              <FeatureCard title="5v5 / 7v7" subtitle="Capacity" />
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <img src="/assets/turf.png" alt="Turf Detail" style={{ width: '100%', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
