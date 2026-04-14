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
        <div className="fade-in hero-content">
          <span style={{ 
            backgroundColor: 'var(--primary)', 
            color: '#000', 
            padding: '6px 16px', 
            borderRadius: '24px', 
            fontSize: '0.75rem', 
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '1.5px'
          }}>
            • Live Availability
          </span>
          <h1 className="hero-title">
            Your Premier <span style={{ color: 'var(--primary)' }}>Pitch</span> Awaits
          </h1>
          <p style={{ 
            fontSize: 'clamp(1rem, 4vw, 1.25rem)', 
            color: 'var(--text-muted)', 
            maxWidth: '600px', 
            margin: '24px 0 40px',
            lineHeight: 1.6
          }}>
            Experience the stadium sanctuary at Wembley Arena A. Professional grade turf for the ultimate game.
          </p>
          <div className="flex-stack" style={{ alignItems: 'center' }}>
            <a href="#booking" className="btn btn-primary">Book a Slot</a>
            <a href="#pitch" className="btn btn-secondary">View Pitch Details</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
