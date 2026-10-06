import { Request, Response, NextFunction } from 'express';
import { CategoriaReporteService } from '../services/categoriaReporte.service';
import { sendSuccess } from '../utils/response';

export const CategoriaReporteController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categorias = await CategoriaReporteService.getAll();
      return sendSuccess(res, 'Categorías obtenidas correctamente', categorias);
    } catch (error) {
      next(error);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const categoria = await CategoriaReporteService.getById(id);
      return sendSuccess(res, 'Categoría obtenida correctamente', categoria);
    } catch (error) {
      next(error);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const nuevaCategoria = await CategoriaReporteService.create(req.body);
      return sendSuccess(res, 'Categoría creada correctamente', nuevaCategoria, 201);
    } catch (error) {
      next(error);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const categoriaActualizada = await CategoriaReporteService.update(id, req.body);
      return sendSuccess(res, 'Categoría actualizada correctamente', categoriaActualizada);
    } catch (error) {
      next(error);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      await CategoriaReporteService.delete(id);
      return sendSuccess(res, 'Categoría eliminada correctamente', null);
    } catch (error) {
      next(error);
    }
  }
};
