import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/db';
import { sendSuccess } from './utils/response';
import { errorHandler } from './middlewares/errorHandler';
import categoriaRoutes from './routes/categoriaReporte.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Endpoints
app.get('/api/health', async (req, res, next) => {
  try {
    const [rows]: any = await pool.query('SELECT NOW() AS now');
    return sendSuccess(res, 'EcoTrack API y Base de Datos MySQL funcionando correctamente', {
      timestamp: rows[0].now
    });
  } catch (error) {
    next(error);
  }
});

app.use('/api/categories', categoriaRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log('[EcoTrack Backend] Servidor ejecutandose en http://localhost:' + PORT);
});
