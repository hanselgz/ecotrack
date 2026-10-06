import { Router } from 'express';
import { ReporteAmbientalController } from '../controllers/reporteAmbiental.controller';

const router = Router();

router.get('/', ReporteAmbientalController.getAll);
router.get('/:id', ReporteAmbientalController.getById);
router.post('/', ReporteAmbientalController.create);
router.patch('/:id/status', ReporteAmbientalController.updateStatus);
router.delete('/:id', ReporteAmbientalController.delete);

export default router;
