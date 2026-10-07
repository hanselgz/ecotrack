import { Request, Response, NextFunction } from 'express';
import { ReporteAmbientalService } from '../services/reporteAmbiental.service';
import { sendSuccess } from '../utils/response';

export const ReporteAmbientalController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reportes = await ReporteAmbientalService.getAll();
      return sendSuccess(res, 'Reportes ambientales obtenidos correctamente', reportes);
    } catch (error) {
      next(error);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const reporte = await ReporteAmbientalService.getById(id);
      return sendSuccess(res, 'Reporte ambiental obtenido correctamente', reporte);
    } catch (error) {
      next(error);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const nuevoReporte = await ReporteAmbientalService.create(req.body);
      return sendSuccess(res, 'Reporte ambiental registrado correctamente', nuevoReporte, 201);
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
      return sendSuccess(res, 'Estado del reporte actualizado correctamente', actualizado);
    } catch (error) {
      next(error);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      await ReporteAmbientalService.delete(id);
      return sendSuccess(res, 'Reporte ambiental eliminado correctamente', null);
    } catch (error) {
      next(error);
    }
  },

  getStats: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await ReporteAmbientalService.getStats();
      return sendSuccess(res, 'Estadisticas obtenidas correctamente', stats);
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
      return sendSuccess(res, 'Evaluacion de impacto registrada correctamente', actualizado);
    } catch (error) {
      next(error);
    }
  }
};