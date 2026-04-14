import React from 'react';
import { MapPin, Navigation } from 'lucide-react';

const Location = () => {
  return (
    <section id="location" style={{ padding: '100px 0', background: 'var(--bg-dark)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '80px', alignItems: 'center' }}>
          <div style={{ 
            height: '400px', 
            background: '#222', 
            borderRadius: '24px', 
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.05)',
            position: 'relative'
          }}>
            {/* Simple Map Placeholder with pitch color circles */}
            <div style={{ width: '100%', height: '100%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(0, 210, 106, 0.1)', position: 'absolute' }}></div>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 20px var(--primary)', zIndex: 2 }}></div>
                <p style={{ position: 'absolute', bottom: '20px', color: '#444', fontSize: '0.8rem' }}>Interactive Map Simulation</p>
            </div>
          </div>
          <div>
            <span style={{ color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem' }}>Easy Access</span>
            <h2 style={{ fontSize: '3rem', fontWeight: 800, margin: '20px 0' }}>Located at the Heart of the Action</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>
              Wembley Arena A is conveniently located just 5 minutes from the Central Station. Multiple bus routes and ample parking make it the easiest pitch to reach for your whole team.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '15px' }}>
                <MapPin color="var(--primary)" />
                <div>
                  <h5 style={{ fontWeight: 700 }}>Unit 14, Arena Park Way</h5>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>North Wembley, London, HA9 0BT</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <Navigation color="var(--primary)" />
                <div>
                  <h5 style={{ fontWeight: 700 }}>Central Station</h5>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>5 minute walk via Wembley Way</p>
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
