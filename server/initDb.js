import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDb() {
    // Priority: DB_PATH env > local data folder > local root (dev)
    const dbPath = process.env.DB_PATH || path.join(__dirname, 'database.sqlite');
    
    // Ensure directory exists
    const dbDir = path.dirname(dbPath);
    if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
    }

    const db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS slots (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT,
            time TEXT,
            status TEXT DEFAULT 'available',
            UNIQUE(date, time)
        );

        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            user_name TEXT,
            user_phone TEXT,
            sport TEXT,
            date TEXT,
            time TEXT,
            turf_id TEXT DEFAULT 'pitch-1',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

    // Pre-generate some slots for the next 7 days if they don't exist
    const times = [
        '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
        '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
    ];

    const today = new Date();
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateString = date.toISOString().split('T')[0];

        for (const time of times) {
            await db.run(
                'INSERT OR IGNORE INTO slots (date, time, status) VALUES (?, ?, ?)',
                [dateString, time, 'available']
            );
        }
    }

    console.log('Database initialized with slots for the next 7 days.');
    return db;
}

if (process.argv[1] === __filename) {
    initDb().catch(console.error);
}

export { initDb };
