import { CategoriaReporteModel, CategoriaReporte } from '../models/categoriaReporte.model';

export const CategoriaReporteService = {
  getAll: async () => {
    return await CategoriaReporteModel.getAll();
  },

  getById: async (id: number) => {
    const categoria = await CategoriaReporteModel.getById(id);
    if (!categoria) {
      const error: any = new Error('Categoría de reporte no encontrada');
      error.statusCode = 404;
      throw error;
    }
    return categoria;
  },

  create: async (data: CategoriaReporte) => {
    if (!data.nombre || data.nombre.trim() === '') {
      const error: any = new Error('El nombre de la categoría es obligatorio');
      error.statusCode = 400;
      throw error;
    }
    return await CategoriaReporteModel.create(data);
  },

  update: async (id: number, data: Partial<CategoriaReporte>) => {
    await CategoriaReporteService.getById(id);
    return await CategoriaReporteModel.update(id, data);
  },

  delete: async (id: number) => {
    await CategoriaReporteService.getById(id);
    return await CategoriaReporteModel.delete(id);
  }
};
