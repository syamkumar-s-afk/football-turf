import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Settings, RefreshCw, Lock, Unlock, Trash2 } from 'lucide-react';

const Admin = ({ adminPass, onLogout }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchSlots(), fetchBookings()]);
    setLoading(false);
  };

  const fetchSlots = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/slots?date=${selectedDate}`);
      setSlots(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/bookings', {
        headers: { 'x-admin-password': adminPass }
      });
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStatus = async (time, currentStatus) => {
    const nextStatus = currentStatus === 'available' ? 'blocked' : 'available';
    try {
      await axios.post('http://localhost:5000/api/admin/slots/toggle', {
        date: selectedDate,
        time,
        status: nextStatus
      }, {
        headers: { 'x-admin-password': adminPass }
      });
      fetchSlots();
    } catch (err) {
      alert('Update failed');
    }
  };

  const bulkUpdate = async (status) => {
    try {
      await axios.post('http://localhost:5000/api/admin/slots/bulk', {
        date: selectedDate,
        slots: slots.map(s => s.time),
        status
      }, {
        headers: { 'x-admin-password': adminPass }
      });
      fetchSlots();
    } catch (err) {
      alert('Bulk update failed');
    }
  };

  return (
    <div style={{ padding: '40px 0', minHeight: '100vh', background: '#000' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontSize: '3rem', fontWeight: 800 }}>Admin Dashboard</h1>
            <p style={{ color: 'var(--text-muted)' }}>Manage your turf availability and bookings.</p>
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button onClick={onLogout} className="btn btn-secondary">Logout</button>
            <button onClick={() => bulkUpdate('available')} className="btn btn-secondary" style={{ color: 'var(--primary)' }}><Unlock size={18} /> Enable All</button>
            <button onClick={() => bulkUpdate('blocked')} className="btn btn-secondary" style={{ borderColor: '#ef4444', color: '#ef4444' }}><Lock size={18} /> Block All</button>
          </div>
        </div>

        <div className="glass" style={{ padding: '40px', borderRadius: '24px' }}>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', alignItems: 'center' }}>
            <label style={{ fontWeight: 600 }}>Manage Date:</label>
            <input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: '#111', color: '#fff' }}
            />
            <button onClick={fetchSlots} className="btn" style={{ background: 'var(--primary)', color: '#000', padding: '10px' }}>
              <RefreshCw size={18} className={loading ? 'spin' : ''} />
            </button>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                <th style={{ padding: '15px 10px', color: 'var(--text-muted)' }}>Time Slot</th>
                <th style={{ padding: '15px 10px', color: 'var(--text-muted)' }}>Status</th>
                <th style={{ padding: '15px 10px', color: 'var(--text-muted)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {slots.map(slot => (
                <tr key={slot.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '20px 10px', fontWeight: 600 }}>{slot.time}</td>
                  <td style={{ padding: '20px 10px' }}>
                    <span style={{ 
                      padding: '4px 10px', 
                      borderRadius: '20px', 
                      fontSize: '0.7rem', 
                      fontWeight: 700,
                      background: slot.status === 'available' ? 'rgba(0, 210, 106, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: slot.status === 'available' ? 'var(--primary)' : '#ef4444',
                      textTransform: 'uppercase'
                    }}>
                      {slot.status}
                    </span>
                  </td>
                  <td style={{ padding: '20px 10px', textAlign: 'right' }}>
                    <button 
                      onClick={() => toggleStatus(slot.time, slot.status)}
                      style={{ 
                        background: 'transparent', 
                        color: slot.status === 'available' ? '#ef4444' : 'var(--primary)',
                        fontSize: '0.8rem',
                        fontWeight: 600
                      }}
                    >
                      {slot.status === 'available' ? 'Block Slot' : 'Unblock Slot'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Inquiries Section */}
        <div className="glass" style={{ padding: '40px', borderRadius: '24px', marginTop: '40px' }}>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '20px' }}>Recent Booking Inquiries</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>These slots have been requested by users but are not yet officially booked in the system.</p>
          
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                <th style={{ padding: '15px 10px', color: 'var(--text-muted)' }}>Name</th>
                <th style={{ padding: '15px 10px', color: 'var(--text-muted)' }}>Phone</th>
                <th style={{ padding: '15px 10px', color: 'var(--text-muted)' }}>Sport</th>
                <th style={{ padding: '15px 10px', color: 'var(--text-muted)' }}>Date & Time</th>
                <th style={{ padding: '15px 10px', color: 'var(--text-muted)', textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No inquiries found.</td>
                </tr>
              ) : (
                bookings.map(booking => (
                  <tr key={booking.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '20px 10px', fontWeight: 600 }}>{booking.user_name}</td>
                    <td style={{ padding: '20px 10px' }}>{booking.user_phone}</td>
                    <td style={{ padding: '20px 10px' }}>
                      <span style={{ 
                        padding: '4px 10px', 
                        borderRadius: '20px', 
                        fontSize: '0.7rem', 
                        fontWeight: 700,
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: '#fff',
                        textTransform: 'uppercase'
                      }}>
                        {booking.sport}
                      </span>
                    </td>
                    <td style={{ padding: '20px 10px' }}>
                      <div style={{ fontWeight: 600 }}>{booking.date}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{booking.time}</div>
                    </td>
                    <td style={{ padding: '20px 10px', textAlign: 'right' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>INQUIRY RECEIVED</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Admin;
