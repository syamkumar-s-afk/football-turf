import React from 'react';

const Footer = () => {
  return (
    <footer style={{ padding: '40px 0', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'var(--bg-dark)' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1.2rem', fontFamily: 'Outfit' }}>TurfPass</div>
        <div style={{ display: 'flex', gap: '30px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms of Service</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Contact Us</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Instagram</a>
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          © 2024 TurfPass. All Rights Reserved. Built for the beautiful game.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
