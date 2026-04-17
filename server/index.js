import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

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

const getDb = async () => {
    if (!db) {
        db = await initDb();
    }
    return db;
};

// Database Diagnostic Route
app.get('/api/debug/db', async (req, res) => {
    const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    const report = {
        hasUrl: !!dbUrl,
        urlPreview: dbUrl ? `${dbUrl.substring(0, 15)}...` : 'NONE',
        nodeEnv: process.env.NODE_ENV,
        isVercel: !!process.env.VERCEL,
        dbStatus: 'testing...'
    };

    try {
        const db = await getDb();
        const result = await db.query('SELECT NOW()');
        report.dbStatus = 'CONNECTED';
        report.timestamp = result.rows[0].now;
        res.json(report);
    } catch (err) {
        report.dbStatus = 'FAILED';
        report.error = err.message;
        report.code = err.code;
        res.status(500).json(report);
    }
});

// Admin: Middleware-like check for mutation routes
const adminAuth = (req, res, next) => {
    const password = req.headers['x-admin-password'];
    if (password === ADMIN_PASSWORD) {
        next();
    } else {
        res.status(403).json({ error: 'Unauthorized credentials' });
    }
};

// Get slots for a specific date (Auto-generates if missing)
app.get('/api/slots', async (req, res) => {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: 'Date is required' });

    try {
        // 1. Fetch existing slots
        let result = await (await getDb()).query('SELECT * FROM slots WHERE date = $1 ORDER BY time ASC', [date]);
        
        // 2. If slots are missing or incomplete (less than 24), generate them
        if (result.rows.length < 24) {
            const times = [];
            for (let h = 0; h < 24; h++) {
                times.push(`${h.toString().padStart(2, '0')}:00`);
            }

            for (const time of times) {
                await (await getDb()).query(
                    'INSERT INTO slots (date, time, status) VALUES ($1, $2, $3) ON CONFLICT (date, time) DO NOTHING',
                    [date, time, 'available']
                );
            }
            // Re-fetch after generation
            result = await (await getDb()).query('SELECT * FROM slots WHERE date = $1 ORDER BY time ASC', [date]);
        }

        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin: Get all booking inquiries
app.get('/api/admin/bookings', adminAuth, async (req, res) => {
    try {
        const result = await (await getDb()).query('SELECT * FROM bookings ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Book a slot
app.post('/api/book', async (req, res) => {
    const { date, time, userId } = req.body;
    if (!date || !time) return res.status(400).json({ error: 'Date and time are required' });

    try {
        const result = await (await getDb()).query('SELECT * FROM slots WHERE date = $1 AND time = $2', [date, time]);
        const slot = result.rows[0];
        
        if (!slot || slot.status !== 'available') {
            return res.status(400).json({ error: 'Slot is not available' });
        }

        await (await getDb()).query(
            'INSERT INTO bookings (user_id, user_name, user_phone, sport, date, time) VALUES ($1, $2, $3, $4, $5, $6)', 
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
        await (await getDb()).query('UPDATE slots SET status = $1 WHERE date = $2 AND time = $3', [status, date, time]);
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
        const placeholders = slots.map((_, i) => `$${i + 3}`).join(',');
        const query = `UPDATE slots SET status = $1 WHERE date = $2 AND time IN (${placeholders})`;
        await (await getDb()).query(query, [status, date, ...slots]);
        res.json({ success: true, message: 'Slots updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// In regular Express (non-Vercel), host static files
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    const distPath = path.join(__dirname, '../dist');
    app.use(express.static(distPath));
    
    app.use((req, res, next) => {
        if (req.method === 'GET' && !req.path.startsWith('/api')) {
            return res.sendFile(path.join(distPath, 'index.html'));
        }
        next();
    });
}

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

export default app;
