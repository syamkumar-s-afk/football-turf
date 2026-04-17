import pg from 'pg';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDb() {
    const isProd = process.env.NODE_ENV === 'production' || process.env.VERCEL;
    const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    const isLocalPostgres = dbUrl && dbUrl.includes('localhost');

    if (isProd || (dbUrl && !isLocalPostgres)) {
        console.log('Using PostgreSQL Database...');
        const pool = new Pool({
            connectionString: dbUrl,
            ssl: isProd ? { rejectUnauthorized: false } : false
        });

        // Test connection
        await pool.query('SELECT NOW()');
        
        // Wrap pool to ensure it returns { rows: [...] }
        return {
            query: (text, params) => pool.query(text, params),
            isPostgres: true
        };
    } else {
        console.log('Using local SQLite Database...');
        const dbPath = path.join(__dirname, 'database.sqlite');
        const db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });

        // Initialize SQLite Tables
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

        // Adapter to make SQLite behave like PG (using $1, $2 placeholders)
        return {
            query: async (text, params = []) => {
                // Convert $1, $2 to ? for SQLite
                const sqliteQuery = text.replace(/\$\d+/g, '?');
                
                if (text.trim().toUpperCase().startsWith('SELECT')) {
                    const rows = await db.all(sqliteQuery, params);
                    return { rows };
                } else {
                    const result = await db.run(sqliteQuery, params);
                    return { rows: [], lastID: result.lastID, changes: result.changes };
                }
            },
            isPostgres: false
        };
    }
}

export { initDb };
