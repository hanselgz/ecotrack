import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/db';
import { sendSuccess } from './utils/response';
import { errorHandler } from './middlewares/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors());
app.use(express.json());

// Endpoint de verificación de estado y salud de la base de datos
app.get('/api/health', async (req, res, next) => {
  try {
    const result = await pool.query('SELECT NOW()');
    return sendSuccess(res, 'EcoTrack API y Base de Datos funcionando correctamente', {
      timestamp: result.rows[0].now
    });
  } catch (error) {
    next(error);
  }
});

// Middleware global de errores (debe ser el último middleware)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(\`[EcoTrack Backend] Servidor ejecutándose en http://localhost:\${PORT}\`);
});