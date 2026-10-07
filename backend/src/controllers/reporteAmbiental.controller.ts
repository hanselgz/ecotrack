import { Request, Response, NextFunction } from 'express';
import { ReporteAmbientalService } from '../services/reporteAmbiental.service';
import { sendSuccess } from '../utils/response';

export const ReporteAmbientalController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reportes = await ReporteAmbientalService.getAll();
      return sendSuccess(res, reportes, 'Reportes ambientales obtenidos correctamente');
    } catch (error) {
      next(error);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const reporte = await ReporteAmbientalService.getById(id);
      return sendSuccess(res, reporte, 'Reporte ambiental obtenido correctamente');
    } catch (error) {
      next(error);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const nuevoReporte = await ReporteAmbientalService.create(req.body);
      return sendSuccess(res, nuevoReporte, 'Reporte ambiental registrado correctamente', 201);
    } catch (error) {
      next(error);
    }
  },

  updateStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const { estado } = req.body || {};

      if (!estado) {
        const error: any = new Error('El campo "estado" es obligatorio en el cuerpo de la peticion');
        error.statusCode = 400;
        throw error;
      }

      const actualizado = await ReporteAmbientalService.updateStatus(id, estado);
      return sendSuccess(res, actualizado, 'Estado del reporte actualizado correctamente');
    } catch (error) {
      next(error);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      await ReporteAmbientalService.delete(id);
      return sendSuccess(res, null, 'Reporte ambiental eliminado correctamente');
    } catch (error) {
      next(error);
    }
  },

  getStats: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await ReporteAmbientalService.getStats();
      return sendSuccess(res, stats, 'Estadisticas obtenidas correctamente');
    } catch (error) {
      next(error);
    }
  },

  evaluarImpacto: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const { nivel_impacto, observaciones } = req.body || {};

      if (!nivel_impacto) {
        const error: any = new Error('El campo "nivel_impacto" es obligatorio');
        error.statusCode = 400;
        throw error;
      }

      const actualizado = await ReporteAmbientalService.evaluarImpacto(id, nivel_impacto, observaciones || '');
      return sendSuccess(res, actualizado, 'Evaluacion de impacto registrada correctamente');
    } catch (error) {
      next(error);
    }
  }
};