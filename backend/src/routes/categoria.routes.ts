import { Router } from 'express';

const router = Router();

// Endpoint mock de categorías para la prueba
router.get('/', (req, res) => {
  return res.status(200).json({
    success: true,
    data: [
      { id: 1, nombre: 'Residuos / Basura' },
      { id: 2, nombre: 'Contaminación del Agua' },
      { id: 3, nombre: 'Contaminación del Aire' },
      { id: 4, nombre: 'Tala de Árboles' },
      { id: 5, nombre: 'Ruido Excesivo' }
    ]
  });
});

export default router;