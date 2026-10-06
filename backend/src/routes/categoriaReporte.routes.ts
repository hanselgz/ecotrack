import { Router } from 'express';
import { CategoriaReporteController } from '../controllers/categoriaReporte.controller';

const router = Router();

router.get('/', CategoriaReporteController.getAll);
router.get('/:id', CategoriaReporteController.getById);
router.post('/', CategoriaReporteController.create);
router.put('/:id', CategoriaReporteController.update);
router.delete('/:id', CategoriaReporteController.delete);

export default router;
