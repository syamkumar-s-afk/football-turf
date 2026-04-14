import pg from 'pg';
const { Pool } = pg;

async function initDb() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS slots (
                id SERIAL PRIMARY KEY,
                date TEXT,
                time TEXT,
                status TEXT DEFAULT 'available',
                UNIQUE(date, time)
            );

            CREATE TABLE IF NOT EXISTS bookings (
                id SERIAL PRIMARY KEY,
                user_id TEXT,
                user_name TEXT,
                user_phone TEXT,
                sport TEXT,
                date TEXT,
                time TEXT,
                turf_id TEXT DEFAULT 'pitch-1',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Pre-generate some slots for the next 7 days if they don't exist
        const times = [];
        for (let h = 0; h < 24; h++) {
          times.push(`${h.toString().padStart(2, '0')}:00`);
        }

        const today = new Date();
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            const dateString = date.toISOString().split('T')[0];

            for (const time of times) {
                await pool.query(
                    'INSERT INTO slots (date, time, status) VALUES ($1, $2, $3) ON CONFLICT (date, time) DO NOTHING',
                    [dateString, time, 'available']
                );
            }
        }

        console.log('PostgreSQL Database initialized with slots for the next 7 days.');
        return pool;
    } catch (err) {
        console.error('Failed to initialize PostgreSQL:', err);
        throw err;
    }
}

export { initDb };
