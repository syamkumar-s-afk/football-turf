import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, CheckCircle } from 'lucide-react';

const Booking = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // User Details State
  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    phone: '',
    sport: 'Football'
  });

  const OWNER_PHONE = '+911234567890'; // Placeholder

  useEffect(() => {
    fetchSlots();
  }, [selectedDate]);

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/slots?date=${selectedDate}`);
      setSlots(res.data);
    } catch (err) {
      console.error('Error fetching slots:', err);
    }
    setLoading(false);
  };

  const handleBooking = async () => {
    if (!selectedSlot) return;
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/book', {
        date: selectedDate,
        time: selectedSlot.time,
        userName: userData.name,
        userPhone: userData.phone,
        sport: userData.sport
      });

      if (res.data.success) {
        // WhatsApp Redirect
        const message = encodeURIComponent(
          `*New Turf Booking* ⚽🏏\n\n` +
          `- Name: ${userData.name}\n` +
          `- Phone: ${userData.phone}\n` +
          `- Sport: ${userData.sport}\n` +
          `- Date: ${selectedDate}\n` +
          `- Slot: ${selectedSlot.time}`
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
    <section id="booking" style={{ padding: '100px 0', background: '#fff', color: '#000', position: 'relative' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '40px' }}>
          {/* Left Panel */}
          <div>
            <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '20px' }}>Secure Your Session</h2>
            <p style={{ color: '#666', marginBottom: '40px' }}>Select your preferred date and time. Prime slots fill up fast.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="glass" style={{ padding: '20px', borderRadius: '12px', border: '1px solid #eee', background: '#f9f9f9', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <Calendar size={24} color="var(--primary)" />
                <div>
                  <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#999', fontWeight: 700 }}>Current Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    style={{ border: 'none', background: 'transparent', fontSize: '1rem', fontWeight: 600, width: '100%', outline: 'none' }}
                  />
                </div>
              </div>

              <div className="glass" style={{ padding: '20px', borderRadius: '12px', border: '1px solid #eee', background: '#f9f9f9', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <Clock size={24} color="var(--primary)" />
                <div>
                  <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#999', fontWeight: 700 }}>Session Length</label>
                  <div style={{ fontSize: '1rem', fontWeight: 600 }}>60 Minutes</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div style={{ background: '#f4f4f5', padding: '40px', borderRadius: '24px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Today's Availability</h3>
              <div style={{ display: 'flex', gap: '15px', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ccc' }}></div> Available</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#eee' }}></div> Booked</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)' }}></div> Selected</span>
              </div>
            </div>

            <div className="slot-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '15px' }}>
              {loading && !showModal ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} style={{ height: 70, background: '#eee', borderRadius: 8, animation: 'pulse 1.5s infinite ease-in-out' }}></div>
                ))
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
                      {slot.time}
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
                  disabled={!userData.name || !/^\+91\d{10}$/.test(userData.phone.replace(/\s/g, '')) || loading}
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
