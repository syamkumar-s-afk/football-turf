import React, { useState } from 'react';
import axios from 'axios';
import { Lock, LogIn } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await axios.post('http://localhost:5000/api/admin/login', { password });
      if (res.data.success) {
        onLogin(password);
      }
    } catch (err) {
      setError('Invalid password. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at center, #1a1a1a 0%, #000 100%)'
    }}>
      <div className="glass fade-in" style={{
        padding: '50px',
        borderRadius: '30px',
        width: '100%',
        maxWidth: '450px',
        textAlign: 'center'
      }}>
        <div style={{
          width: '70px',
          height: '70px',
          background: 'rgba(0, 210, 106, 0.1)',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 30px',
          color: 'var(--primary)'
        }}>
          <Lock size={32} />
        </div>

        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '10px' }}>Admin Access</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>Enter your security credentials to manage the pitch.</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <input 
            type="password" 
            placeholder="Security Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              padding: '15px 20px',
              borderRadius: '12px',
              border: '1px solid var(--border)',
              background: 'rgba(255,255,255,0.05)',
              color: '#fff',
              fontSize: '1rem',
              outline: 'none',
              textAlign: 'center'
            }}
          />
          
          {error && <p style={{ color: '#ef4444', fontSize: '0.9rem', fontWeight: 500 }}>{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary" 
            style={{ width: '100%', justifyContent: 'center', height: '55px', fontSize: '1.1rem' }}
          >
            {loading ? 'Verifying...' : 'Login to Dashboard'}
          </button>
        </form>

        <p style={{ marginTop: '30px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            Authorized Personnel Only
        </p>
      </div>
    </div>
  );
};

export default Login;
