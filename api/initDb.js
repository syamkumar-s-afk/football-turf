import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDb() {
    const isProd = process.env.NODE_ENV === 'production' || process.env.VERCEL;
    const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    const isLocalPostgres = dbUrl && dbUrl.includes('localhost');

    console.log('--- Database Initialization ---');
    console.log(`Environment: ${isProd ? 'Production/Vercel' : 'Local'}`);
    console.log(`Connection URL present: ${!!dbUrl}`);

    if (isProd || (dbUrl && !isLocalPostgres)) {
        console.log('Target: PostgreSQL');
        if (!dbUrl) {
            console.error('CRITICAL: DATABASE_URL is missing in Production!');
            throw new Error('DATABASE_URL is not configured');
        }

        const pool = new Pool({
            connectionString: dbUrl,
            ssl: isProd ? { rejectUnauthorized: false } : false
        });

        try {
            console.log('Attempting PostgreSQL connection...');
            const result = await pool.query('SELECT NOW()');
            console.log('PostgreSQL Connected Successfully at:', result.rows[0].now);
            
            return {
                query: (text, params) => pool.query(text, params),
                isPostgres: true
            };
        } catch (err) {
            console.error('PostgreSQL Connection Failed:', err.message);
            throw err;
        }
    } else {
        console.log('Target: Local SQLite');
        
        // Lazy load SQLite ONLY when running locally to keep Vercel light
        console.log('Loading SQLite drivers...');
        const sqlite3 = (await import('sqlite3')).default;
        const { open } = await import('sqlite');
        
        const dbPath = path.join(__dirname, 'database.sqlite');
        console.log(`SQLite Path: ${dbPath}`);
        
        const db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });

        console.log('Initializing SQLite Tables...');
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

        console.log('SQLite Ready.');
        return {
            query: async (text, params = []) => {
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
