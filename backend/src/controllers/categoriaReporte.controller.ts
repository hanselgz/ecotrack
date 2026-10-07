import { Request, Response, NextFunction } from 'express';
import { CategoriaReporteService } from '../services/categoriaReporte.service';
import { sendSuccess } from '../utils/response';

export const CategoriaReporteController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categorias = await CategoriaReporteService.getAll();
      return sendSuccess(res, categorias, 'Categorias obtenidas correctamente');
    } catch (error) {
      next(error);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const categoria = await CategoriaReporteService.getById(id);
      return sendSuccess(res, categoria, 'Categoria obtenida correctamente');
    } catch (error) {
      next(error);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const nuevaCategoria = await CategoriaReporteService.create(req.body);
      return sendSuccess(res, nuevaCategoria, 'Categoria creada correctamente', 201);
    } catch (error) {
      next(error);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const categoriaActualizada = await CategoriaReporteService.update(id, req.body);
      return sendSuccess(res, categoriaActualizada, 'Categoria actualizada correctamente');
    } catch (error) {
      next(error);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      await CategoriaReporteService.delete(id);
      return sendSuccess(res, null, 'Categoria eliminada correctamente');
    } catch (error) {
      next(error);
    }
  }
};
