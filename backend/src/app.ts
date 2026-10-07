import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import reporteAmbientalRoutes from './routes/reporteAmbiental.routes';
import authRoutes from './routes/auth.routes';
import categoriaRoutes from './routes/categoria.routes'; // <-- 1. Importar el enrutador de categorías

const app: Application = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de la API
app.use('/api/reportes-ambientales', reporteAmbientalRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categorias', categoriaRoutes); // <-- 2. Registrar /api/categorias

// Manejo de rutas no encontradas (404)
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Middleware global de manejo de errores
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

export default app;