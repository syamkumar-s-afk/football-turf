import React from 'react';

const Hero = () => {
  return (
    <section className="hero" style={{
      height: '100vh',
      width: '100%',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      background: 'url("/assets/hero.png") no-repeat center center/cover'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(9,9,9,1))',
        zIndex: 1
      }}></div>

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="fade-in">
          <span style={{ 
            backgroundColor: 'var(--primary)', 
            color: '#000', 
            padding: '4px 12px', 
            borderRadius: '20px', 
            fontSize: '0.8rem', 
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            • Live Availability
          </span>
          <h1 style={{ 
            fontSize: '5rem', 
            fontWeight: 800, 
            marginTop: '20px', 
            maxWidth: '800px',
            lineHeight: 1.1 
          }}>
            Your Premier <span style={{ color: 'var(--primary)' }}>Pitch</span> Awaits
          </h1>
          <p style={{ 
            fontSize: '1.2rem', 
            color: 'var(--text-muted)', 
            maxWidth: '600px', 
            margin: '30px 0' 
          }}>
            Experience the stadium sanctuary at Wembley Arena A. Professional grade turf for the ultimate game.
          </p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <a href="#booking" className="btn btn-primary">Book a Slot</a>
            <a href="#pitch" className="btn btn-secondary">View Pitch Details</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
