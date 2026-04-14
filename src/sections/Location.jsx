import React from 'react';
import { MapPin, Navigation } from 'lucide-react';

const Location = () => {
  return (
    <section id="location" style={{ padding: '80px 0', background: 'var(--bg-dark)' }}>
      <div className="container">
        <div className="section-grid section-grid-wide">
          <div style={{ 
            height: '350px', 
            background: '#111', 
            borderRadius: '24px', 
            overflow: 'hidden',
            position: 'relative'
          }} className="glass">
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(0, 210, 106, 0.05)', position: 'absolute' }}></div>
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 20px var(--primary)', zIndex: 2 }}></div>
                <p style={{ position: 'absolute', bottom: '20px', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Interactive Map Simulation</p>
            </div>
          </div>
          <div>
            <span style={{ color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.75rem' }}>Easy Access</span>
            <h2 style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', fontWeight: 800, margin: '16px 0', lineHeight: 1.2 }}>Located at the Heart of the Action</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '32px', lineHeight: 1.6 }}>
              Wembley Arena A is conveniently located just 5 minutes from the Central Station. Multiple bus routes and ample parking make it the easiest pitch to reach.
            </p>
            
            <div className="flex-stack" style={{ gap: '24px' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <MapPin color="var(--primary)" size={24} />
                <div>
                  <h5 style={{ fontWeight: 800, fontSize: '1.1rem' }}>Unit 14, Arena Park Way</h5>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px' }}>North Wembley, London, HA9 0BT</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <Navigation color="var(--primary)" size={24} />
                <div>
                  <h5 style={{ fontWeight: 800, fontSize: '1.1rem' }}>Central Station</h5>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px' }}>5 minute walk via Wembley Way</p>
                </div>
              </div>
            </div>

            <button className="btn btn-secondary" style={{ marginTop: '40px' }}>Get Directions</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Location;
