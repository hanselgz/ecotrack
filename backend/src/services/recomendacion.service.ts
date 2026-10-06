import { RecomendacionModel, Recomendacion } from '../models/recomendacion.model';

export const RecomendacionService = {
  getAll: async () => {
    return await RecomendacionModel.getAll();
  },

  getById: async (id: number) => {
    const recomendacion = await RecomendacionModel.getById(id);
    if (!recomendacion) {
      const error: any = new Error('Recomendacion no encontrada');
      error.statusCode = 404;
      throw error;
    }
    return recomendacion;
  },

  create: async (data: Recomendacion) => {
    if (!data.titulo || !data.descripcion || !data.categoria_impacto || !data.accion_sugerida) {
      const error: any = new Error('Todos los campos son obligatorios: titulo, descripcion, categoria_impacto, accion_sugerida');
      error.statusCode = 400;
      throw error;
    }
    return await RecomendacionModel.create(data);
  },

  update: async (id: number, data: Partial<Recomendacion>) => {
    await RecomendacionService.getById(id);
    return await RecomendacionModel.update(id, data);
  },

  delete: async (id: number) => {
    await RecomendacionService.getById(id);
    return await RecomendacionModel.delete(id);
  }
};
