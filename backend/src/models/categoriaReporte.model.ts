import pool from '../config/db';

export interface CategoriaReporte {
  id?: number;
  nombre: string;
  descripcion?: string;
  icono?: string;
}

export const CategoriaReporteModel = {
  getAll: async (): Promise<CategoriaReporte[]> => {
    const [rows]: any = await pool.query('SELECT * FROM categorias_reporte ORDER BY id ASC');
    return rows as CategoriaReporte[];
  },

  getById: async (id: number): Promise<CategoriaReporte | null> => {
    const [rows]: any = await pool.query('SELECT * FROM categorias_reporte WHERE id = ?', [id]);
    if (rows.length === 0) return null;
    return rows[0] as CategoriaReporte;
  },

  create: async (data: CategoriaReporte): Promise<CategoriaReporte> => {
    const { nombre, descripcion, icono } = data;
    const [result]: any = await pool.query(
      'INSERT INTO categorias_reporte (nombre, descripcion, icono) VALUES (?, ?, ?)',
      [nombre, descripcion || null, icono || null]
    );
    return { id: result.insertId, ...data };
  },

  update: async (id: number, data: Partial<CategoriaReporte>): Promise<CategoriaReporte | null> => {
    const { nombre, descripcion, icono } = data;
    await pool.query(
      'UPDATE categorias_reporte SET nombre = ?, descripcion = ?, icono = ? WHERE id = ?',
      [nombre, descripcion || null, icono || null, id]
    );
    return CategoriaReporteModel.getById(id);
  },

  delete: async (id: number): Promise<boolean> => {
    const [result]: any = await pool.query('DELETE FROM categorias_reporte WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};
