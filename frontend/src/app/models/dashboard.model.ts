export interface EstadoStat {
  estado: string;
  cantidad: number;
}

export interface CategoriaStat {
  nombre: string;
  cantidad: number;
}

export interface DashboardStats {
  total_reportes: number;
  por_estado: EstadoStat[];
  por_categoria: CategoriaStat[];
}