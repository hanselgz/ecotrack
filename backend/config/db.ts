import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false
});

pool.on('connect', () => {
  console.log('[Database] Conexion establecida exitosamente con PostgreSQL');
});

pool.on('error', (err) => {
  console.error('[Database] Error inesperado en el cliente de PostgreSQL:', err);
});

export default pool;
