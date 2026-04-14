import React from 'react';

const Testimonial = ({ text, author, role }) => (
  <div className="glass" style={{
    padding: '32px',
    borderRadius: '24px',
    flex: '1 1 300px'
  }}>
    <p style={{ fontSize: '1.1rem', fontStyle: 'italic', color: '#eee', marginBottom: '24px', lineHeight: 1.6 }}>"{text}"</p>
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 800 }}>{author[0]}</div>
      <div>
        <h5 style={{ fontWeight: 800, fontSize: '1rem' }}>{author}</h5>
        <p style={{ fontSize: '0.75rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>{role}</p>
      </div>
    </div>
  </div>
);

const Testimonials = () => {
  return (
    <section style={{ padding: '80px 0', background: 'var(--bg-dark)' }}>
      <div className="container">
        <div className="section-grid section-grid-wide">
          <div>
            <span style={{ color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.75rem' }}>Social Proof</span>
            <h2 style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', fontWeight: 800, margin: '16px 0', lineHeight: 1.2 }}>Trusted by the Pros</h2>
            <div style={{ display: 'flex', gap: '4px', color: 'var(--primary)', marginBottom: '24px', fontSize: '1.2rem' }}>
              {Array.from({ length: 5 }).map((_, i) => <span key={i}>★</span>)}
            </div>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>Over 500 local teams call Wembley Arena A their home ground. Here is why.</p>
          </div>
          <div className="flex-stack" style={{ flexWrap: 'wrap', gap: '24px' }}>
            <Testimonial 
              text="The bounce of the ball is consistent, and the drainage is insane. Even after heavy rain, the pitch is perfect."
              author="Marcus Chen"
              role="Semi-Pro Forward"
            />
            <Testimonial 
              text="The best turf in the city. The amenities are better than most professional clubs I've visited."
              author="David Sterling"
              role="Coach, West League"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
