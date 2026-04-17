import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, CheckCircle } from 'lucide-react';

const Booking = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // User Details State
  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    phone: '',
    sport: 'Football'
  });

  const OWNER_PHONE = '+911234567890'; // Placeholder

  const formatAMPM = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    let h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12; // the hour '0' should be '12'
    return `${h.toString().padStart(2, '0')}:${minutes} ${ampm}`;
  };

  useEffect(() => {
    fetchSlots();
  }, [selectedDate]);

  const fetchSlots = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/api/slots?date=${selectedDate}`);
      setSlots(res.data);
    } catch (err) {
      console.error('Error fetching slots:', err);
      const msg = err.response?.data?.error || err.response?.data?.dbStatus === 'FAILED' 
        ? `Database Error: ${err.response.data.error || 'Connection failed'}` 
        : 'Unable to load slots. Please check your connection or try again later.';
      setError(msg);
    }
    setLoading(false);
  };

  const handleBooking = async () => {
    if (!selectedSlot) return;
    setLoading(true);

    let normalizedPhone = userData.phone.replace(/\s/g, '');
    if (/^\d{10}$/.test(normalizedPhone)) {
      normalizedPhone = `+91${normalizedPhone}`;
    }

    try {
      const res = await axios.post('/api/book', {
        date: selectedDate,
        time: selectedSlot.time,
        userName: userData.name,
        userPhone: normalizedPhone,
        sport: userData.sport
      });

      if (res.data.success) {
        // WhatsApp Redirect
        const message = encodeURIComponent(
          `*New Turf Booking* ⚽🏏\n\n` +
          `- Name: ${userData.name}\n` +
          `- Phone: ${normalizedPhone}\n` +
          `- Sport: ${userData.sport}\n` +
          `- Date: ${selectedDate}\n` +
          `- Slot: ${formatAMPM(selectedSlot.time)}`
        );
        window.open(`https://wa.me/${OWNER_PHONE}?text=${message}`, '_blank');

        setSuccess(true);
        setShowModal(false);
        setSelectedSlot(null);
        fetchSlots();
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Booking failed');
    }
    setLoading(false);
  };

  return (
    <section id="booking" style={{ padding: '80px 0', background: 'var(--bg-dark)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span style={{ color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.75rem' }}>Reserve Your Game</span>
          <h2 style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', fontWeight: 800, marginTop: '12px' }}>Check Availability</h2>
        </div>

        <div className="section-grid">
          {/* Left Panel */}
          <div className="flex-stack" style={{ gap: '24px' }}>
            <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <Calendar color="var(--primary)" size={24} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Select Date</h3>
              </div>
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="glass"
                style={{ 
                  width: '100%', 
                  padding: '16px', 
                  borderRadius: '12px', 
                  color: '#fff', 
                  fontSize: '1rem',
                  outline: 'none',
                  cursor: 'pointer',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              />
            </div>

            <div className="glass" style={{ padding: '24px', borderRadius: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <Clock color="var(--primary)" size={24} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Booking Info</h3>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Select a slot to start your inquiry. Admin will confirm your booking via WhatsApp.
              </p>
            </div>
          </div>

          {/* Right Panel */}
          <div className="glass" style={{ padding: '32px', borderRadius: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '16px' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Available Slots</h3>
              <div style={{ display: 'flex', gap: '12px', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: 8, height: 8, borderRadius: '2px', background: '#e4e4e7' }}></div> Avail</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: 8, height: 8, borderRadius: '2px', background: 'rgba(255,255,255,0.1)' }}></div> Booked</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: 8, height: 8, borderRadius: '2px', background: 'var(--primary)' }}></div> Selected</span>
              </div>
            </div>

            <div className="slot-grid">
              {loading && !showModal ? (
                Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} style={{ aspectRatio: '1/1', background: 'rgba(255,255,255,0.05)', borderRadius: 12, animation: 'pulse 1.5s infinite ease-in-out' }}></div>
                ))
              ) : error ? (
                <div style={{ gridColumn: '1 / -1', padding: '40px 20px', textAlign: 'center', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                  <p style={{ color: '#ef4444', fontWeight: 600 }}>{error}</p>
                  <button onClick={fetchSlots} style={{ marginTop: '15px', background: 'transparent', color: 'var(--primary)', fontWeight: 700, textDecoration: 'underline' }}>Try Again</button>
                </div>
              ) : (
                slots.map((slot) => {
                  const isSelected = selectedSlot?.id === slot.id;
                  const isBooked = slot.status === 'booked' || slot.status === 'blocked';

                  return (
                    <button
                      key={slot.id}
                      disabled={isBooked}
                      onClick={() => setSelectedSlot(slot)}
                      className={`slot ${isBooked ? 'booked' : isSelected ? 'selected' : 'available'}`}
                    >
                      {formatAMPM(slot.time)}
                      <span>{isSelected ? 'SELECTED' : slot.status.toUpperCase()}</span>
                    </button>
                  );
                })
              )}
            </div>

            <button
              onClick={() => setShowModal(true)}
              disabled={!selectedSlot || loading}
              className="btn"
              style={{
                width: '100%',
                marginTop: '30px',
                backgroundColor: selectedSlot ? 'var(--primary)' : '#eee',
                color: selectedSlot ? '#000' : '#999',
                justifyContent: 'center',
                height: '60px',
                fontSize: '1.1rem',
                cursor: !selectedSlot ? 'not-allowed' : 'pointer'
              }}
            >
              {success ? (
                <><CheckCircle size={20} /> Booking Confirmed!</>
              ) : (
                `Confirm Booking — ₹1000/hr`
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Detail Capture Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '20px'
        }}>
          <div className="glass fade-in" style={{
            background: '#fff',
            padding: '40px',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '500px',
            color: '#000'
          }}>
            <h3 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '10px' }}>Finalize Booking</h3>
            <p style={{ color: '#666', marginBottom: '30px' }}>Please provide your details to sync with our system.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#999' }}>Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={userData.name}
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                  style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #ddd', marginTop: '5px', outline: 'none', fontSize: '1rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#999' }}>Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={userData.phone}
                  onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                  style={{ width: '100%', padding: '15px', borderRadius: '12px', border: '1px solid #ddd', marginTop: '5px', outline: 'none', fontSize: '1rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#999' }}>Select Sport</label>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  {['Football', 'Cricket'].map(sport => (
                    <button
                      key={sport}
                      onClick={() => setUserData({ ...userData, sport })}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '10px',
                        border: '2px solid',
                        borderColor: userData.sport === sport ? 'var(--primary)' : '#eee',
                        background: userData.sport === sport ? 'rgba(0, 210, 106, 0.1)' : 'transparent',
                        fontWeight: 600,
                        color: userData.sport === sport ? 'var(--primary)' : '#999'
                      }}
                    >
                      {sport}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                <button
                  onClick={() => setShowModal(false)}
                  className="btn"
                  style={{ flex: 1, background: '#fff', color: '#000', border: '1px solid #ddd', justifyContent: 'center' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleBooking}
                  disabled={!userData.name || !(/^\+91\d{10}$/.test(userData.phone.replace(/\s/g, '')) || /^\d{10}$/.test(userData.phone.replace(/\s/g, ''))) || loading}
                  className="btn btn-primary"
                  style={{ flex: 2, justifyContent: 'center' }}
                >
                  {loading ? 'Confirming...' : 'Confirm & Notify Owner'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </section>
  );
};

export default Booking;
