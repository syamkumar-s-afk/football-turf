import express from 'express';
import cors from 'cors';
import { initDb } from './initDb.js';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let db;

(async () => {
    db = await initDb();
})();

const ADMIN_PASSWORD = 'admin123';

// Admin: Middleware-like check for mutation routes
const adminAuth = (req, res, next) => {
    const password = req.headers['x-admin-password'];
    if (password === ADMIN_PASSWORD) {
        next();
    } else {
        res.status(403).json({ error: 'Unauthorized credentials' });
    }
};

// Get slots for a specific date
app.get('/api/slots', async (req, res) => {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: 'Date is required' });

    try {
        const slots = await db.all('SELECT * FROM slots WHERE date = ?', [date]);
        res.json(slots);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: Get all booking inquiries
app.get('/api/admin/bookings', adminAuth, async (req, res) => {
    try {
        const bookings = await db.all('SELECT * FROM bookings ORDER BY created_at DESC');
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Book a slot
app.post('/api/book', async (req, res) => {
    const { date, time, userId } = req.body;
    if (!date || !time) return res.status(400).json({ error: 'Date and time are required' });

    try {
        const slot = await db.get('SELECT * FROM slots WHERE date = ? AND time = ?', [date, time]);
        
        if (!slot || slot.status !== 'available') {
            return res.status(400).json({ error: 'Slot is not available' });
        }

        // Removed automatic status update: Only admin can book slots manually now.
        // await db.run('UPDATE slots SET status = "booked" WHERE date = ? AND time = ?', [date, time]);
        await db.run(
            'INSERT INTO bookings (user_id, user_name, user_phone, sport, date, time) VALUES (?, ?, ?, ?, ?, ?)', 
            [userId || 'anonymous', req.body.userName, req.body.userPhone, req.body.sport, date, time]
        );

        res.json({ success: true, message: 'Booking inquiry received' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: Login
app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
        res.json({ success: true, message: 'Login successful' });
    } else {
        res.status(401).json({ error: 'Invalid password' });
    }
});

// Admin: Toggle slot status
app.post('/api/admin/slots/toggle', adminAuth, async (req, res) => {
    const { date, time, status } = req.body;
    if (!date || !time || !status) return res.status(400).json({ error: 'Missing parameters' });

    try {
        await db.run('UPDATE slots SET status = ? WHERE date = ? AND time = ?', [status, date, time]);
        res.json({ success: true, message: `Slot status updated to ${status}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: Bulk update
app.post('/api/admin/slots/bulk', adminAuth, async (req, res) => {
    const { date, slots, status } = req.body;
    if (!date || !slots || !status) return res.status(400).json({ error: 'Missing parameters' });

    try {
        const placeholders = slots.map(() => '?').join(',');
        await db.run(`UPDATE slots SET status = ? WHERE date = ? AND time IN (${placeholders})`, [status, date, ...slots]);
        res.json({ success: true, message: 'Slots updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Host Static Files (Production)
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// ... existing routes ...

// SPA Catch-all: All other requests go to index.html
app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
        return res.sendFile(path.join(distPath, 'index.html'));
    }
    next();
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
