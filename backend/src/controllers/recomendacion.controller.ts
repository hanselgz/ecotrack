import { Request, Response, NextFunction } from 'express';
import { RecomendacionService } from '../services/recomendacion.service';
import { sendSuccess } from '../utils/response';

export const RecomendacionController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const recomendaciones = await RecomendacionService.getAll();
      return sendSuccess(res, 'Recomendaciones obtenidas correctamente', recomendaciones);
    } catch (error) {
      next(error);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const recomendacion = await RecomendacionService.getById(id);
      return sendSuccess(res, 'Recomendacion obtenida correctamente', recomendacion);
    } catch (error) {
      next(error);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const nueva = await RecomendacionService.create(req.body);
      return sendSuccess(res, 'Recomendacion creada correctamente', nueva, 201);
    } catch (error) {
      next(error);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const actualizada = await RecomendacionService.update(id, req.body);
      return sendSuccess(res, 'Recomendacion actualizada correctamente', actualizada);
    } catch (error) {
      next(error);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      await RecomendacionService.delete(id);
      return sendSuccess(res, 'Recomendacion eliminada correctamente', null);
    } catch (error) {
      next(error);
    }
  }
};
