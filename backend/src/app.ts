import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import reporteAmbientalRoutes from './routes/reporteAmbiental.routes';
import recomendacionRoutes from './routes/recomendacion.routes';
import authRoutes from './routes/auth.routes';
import categoriaRoutes from './routes/categoria.routes';
import categoriaReporteRoutes from './routes/categoriaReporte.routes';
import impactoRoutes from './routes/impacto.routes';
import { errorHandler } from './middlewares/errorHandler';

const app: Application = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[API] ${req.method} ${req.originalUrl}`);
  next();
});

app.use('/api', impactoRoutes);
app.use('/api/reportes-ambientales', reporteAmbientalRoutes);
app.use('/api/recomendaciones', recomendacionRoutes);
app.use('/api/recommendations', recomendacionRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categorias', categoriaReporteRoutes);
app.use('/api/categories', categoriaReporteRoutes);
app.use('/api/categoria', categoriaRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `No existe la ruta ${req.method} ${req.originalUrl}`,
    data: null
  });
});

app.use(errorHandler);

export default app;