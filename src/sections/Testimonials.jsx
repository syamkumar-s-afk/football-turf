import React from 'react';

const Testimonial = ({ text, author, role }) => (
  <div style={{
    background: '#1a1a1a',
    padding: '40px',
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.05)',
    flex: 1
  }}>
    <p style={{ fontSize: '1.2rem', fontStyle: 'italic', color: '#eee', marginBottom: '30px' }}>"{text}"</p>
    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
      <div style={{ width: '50px', height: '50px', background: '#333', borderRadius: '50%' }}></div>
      <div>
        <h5 style={{ fontWeight: 700, fontSize: '1rem' }}>{author}</h5>
        <p style={{ fontSize: '0.8rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>{role}</p>
      </div>
    </div>
  </div>
);

const Testimonials = () => {
  return (
    <section style={{ padding: '100px 0', background: 'var(--bg-dark)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '60px', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '20px' }}>Trusted by the Pros</h2>
            <div style={{ display: 'flex', gap: '5px', color: 'var(--primary)', marginBottom: '30px' }}>
              {Array.from({ length: 5 }).map((_, i) => <span key={i}>★</span>)}
            </div>
            <p style={{ color: 'var(--text-muted)' }}>Over 500 local teams call Wembley Arena A their home ground. Here is why.</p>
          </div>
          <div style={{ display: 'flex', gap: '30px' }}>
            <Testimonial 
              text="The bounce of the ball is consistent, and the drainage is insane. Even after heavy rain, the pitch is perfect in 10 minutes."
              author="Marcus Chen"
              role="Semi-Pro Forward"
            />
            <Testimonial 
              text="The best turf in the city. The amenities are better than most professional clubs I've visited. Highly recommended."
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
