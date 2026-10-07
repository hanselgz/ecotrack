import { Router } from 'express';
import { ReporteAmbientalController } from '../controllers/reporteAmbiental.controller';

const router = Router();

// Rutas especificas
router.get('/stats', ReporteAmbientalController.getStats);

// Rutas generales
router.get('/', ReporteAmbientalController.getAll);
router.get('/:id', ReporteAmbientalController.getById);
router.post('/', ReporteAmbientalController.create);
router.post('/:id/evaluacion', ReporteAmbientalController.evaluarImpacto);
router.patch('/:id/estado', ReporteAmbientalController.updateStatus);
router.delete('/:id', ReporteAmbientalController.delete);

export default router;