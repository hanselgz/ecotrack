import { Request, Response, NextFunction } from 'express';
import { RecomendacionService } from '../services/recomendacion.service';
import { sendSuccess } from '../utils/response';

export const RecomendacionController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recomendaciones = await RecomendacionService.getAll();
      return sendSuccess(res, recomendaciones, 'Recomendaciones obtenidas correctamente');
    } catch (error) {
      next(error);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const recomendacion = await RecomendacionService.getById(id);
      return sendSuccess(res, recomendacion, 'Recomendacion obtenida correctamente');
    } catch (error) {
      next(error);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const nueva = await RecomendacionService.create(req.body);
      return sendSuccess(res, nueva, 'Recomendacion creada correctamente', 201);
    } catch (error) {
      next(error);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const actualizada = await RecomendacionService.update(id, req.body);
      return sendSuccess(res, actualizada, 'Recomendacion actualizada correctamente');
    } catch (error) {
      next(error);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      await RecomendacionService.delete(id);
      return sendSuccess(res, null, 'Recomendacion eliminada correctamente');
    } catch (error) {
      next(error);
    }
  }
};
