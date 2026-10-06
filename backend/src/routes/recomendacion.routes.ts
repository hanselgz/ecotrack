import { Router } from 'express';
import { RecomendacionController } from '../controllers/recomendacion.controller';

const router = Router();

router.get('/', RecomendacionController.getAll);
router.get('/:id', RecomendacionController.getById);
router.post('/', RecomendacionController.create);
router.put('/:id', RecomendacionController.update);
router.delete('/:id', RecomendacionController.delete);

export default router;
