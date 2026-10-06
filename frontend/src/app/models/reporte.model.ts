export interface Ubicacion {
  id?: number;
  departamento: string;
  municipio: string;
  direccion?: string;
  referencia?: string;
  latitud: number;
  longitud: number;
}

export interface Categoria {
  id: number;
  nombre: string;
  icono?: string;
}

export interface ReporteAmbiental {
  id: number;
  titulo: string;
  descripcion: string;
  fotografia?: string;
  estado: 'Pendiente' | 'En revision' | 'Verificado' | 'Resuelto' | 'Rechazado';
  fecha_creacion?: string;
  fecha_actualizacion?: string;
  categoria_id: number;
  categoria_nombre?: string;
  categoria_icono?: string;
  usuario_id: number;
  usuario_nombre?: string;
  usuario_apellido?: string;
  usuario_email?: string;
  ubicacion_id?: number;
  departamento?: string;
  municipio?: string;
  direccion?: string;
  referencia?: string;
  latitud?: number;
  longitud?: number;
}

export interface ReporteInput {
  titulo: string;
  descripcion: string;
  fotografia?: string;
  estado?: string;
  usuario_id: number;
  categoria_id: number;
  ubicacion: Ubicacion;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}