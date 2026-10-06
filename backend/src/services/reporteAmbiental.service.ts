import { ReporteAmbientalModel, ReporteAmbientalInput } from '../models/reporteAmbiental.model';

export const ReporteAmbientalService = {
  getAll: async () => {
    return await ReporteAmbientalModel.getAll();
  },

  getById: async (id: number) => {
    const reporte = await ReporteAmbientalModel.getById(id);
    if (!reporte) {
      const error: any = new Error('Reporte ambiental no encontrado');
      error.statusCode = 404;
      throw error;
    }
    return reporte;
  },

  create: async (data: ReporteAmbientalInput) => {
    const { titulo, descripcion, usuario_id, categoria_id, ubicacion } = data;

    if (!titulo || !descripcion || !usuario_id || !categoria_id || !ubicacion) {
      const error: any = new Error('Faltan campos obligatorios: titulo, descripcion, usuario_id, categoria_id, ubicacion');
      error.statusCode = 400;
      throw error;
    }

    if (!ubicacion.departamento || !ubicacion.municipio || ubicacion.latitud === undefined || ubicacion.longitud === undefined) {
      const error: any = new Error('La ubicación debe contener departamento, municipio, latitud y longitud');
      error.statusCode = 400;
      throw error;
    }

    return await ReporteAmbientalModel.create(data);
  },

  updateStatus: async (id: number, estado: string) => {
    const estadosValidos = ['Pendiente', 'En revisión', 'Verificado', 'Resuelto', 'Rechazado'];
    if (!estadosValidos.includes(estado)) {
      const error: any = new Error('Estado no válido');
      error.statusCode = 400;
      throw error;
    }

    await ReporteAmbientalService.getById(id);
    return await ReporteAmbientalModel.updateStatus(id, estado);
  },

  delete: async (id: number) => {
    await ReporteAmbientalService.getById(id);
    return await ReporteAmbientalModel.delete(id);
  }
};
