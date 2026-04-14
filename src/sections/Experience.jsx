import React from 'react';

const FeatureCard = ({ title, subtitle }) => (
  <div className="glass" style={{
    padding: '24px',
    borderRadius: '16px',
    flex: '1 1 120px',
    textAlign: 'center'
  }}>
    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>{title}</h3>
    <p style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '1px', marginTop: '4px' }}>{subtitle}</p>
  </div>
);

const Experience = () => {
  return (
    <section id="pitch" style={{ padding: '80px 0', background: 'var(--bg-dark)' }}>
      <div className="container">
        <div className="section-grid">
          <div>
            <span style={{ color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.75rem' }}>The Experience</span>
            <h2 style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 800, margin: '16px 0', lineHeight: 1.2 }}>Engineered for Peak Performance</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '32px', lineHeight: 1.6 }}>
              Wembley Arena A isn't just a pitch, it's a sanctuary for the beautiful game. Built with the latest FIFA Pro standard synthetic fibers, it offers the perfect balance of grip and cushion.
            </p>
            <div className="flex-stack" style={{ flexWrap: 'wrap', gap: '16px' }}>
              <FeatureCard title="FIFA Pro" subtitle="Turf Quality" />
              <FeatureCard title="70x50m" subtitle="Dimensions" />
              <FeatureCard title="5v5 / 7v7" subtitle="Capacity" />
            </div>
          </div>
          <div style={{ position: 'relative', marginTop: '40px' }} className="desktop-only-mt-0">
            <img src="/assets/turf.png" alt="Turf Detail" style={{ width: '100%', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }} />
          </div>
        </div>
      </div>
      <style>{`
        @media (min-width: 1024px) {
          .desktop-only-mt-0 { margin-top: 0 !important; }
        }
      `}</style>
    </section>
  );
};

export default Experience;
