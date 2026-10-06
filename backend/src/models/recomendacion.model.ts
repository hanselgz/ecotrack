import pool from '../config/db';

export interface Recomendacion {
  id?: number;
  titulo: string;
  descripcion: string;
  categoria_impacto: 'Transporte' | 'Energía' | 'Agua' | 'Residuos' | 'General';
  accion_sugerida: string;
}

export const RecomendacionModel = {
  getAll: async (): Promise<Recomendacion[]> => {
    const [rows]: any = await pool.query('SELECT * FROM recomendaciones ORDER BY id ASC');
    return rows as Recomendacion[];
  },

  getById: async (id: number): Promise<Recomendacion | null> => {
    const [rows]: any = await pool.query('SELECT * FROM recomendaciones WHERE id = ?', [id]);
    if (rows.length === 0) return null;
    return rows[0] as Recomendacion;
  },

  create: async (data: Recomendacion): Promise<Recomendacion> => {
    const { titulo, descripcion, categoria_impacto, accion_sugerida } = data;
    const [result]: any = await pool.query(
      'INSERT INTO recomendaciones (titulo, descripcion, categoria_impacto, accion_sugerida) VALUES (?, ?, ?, ?)',
      [titulo, descripcion, categoria_impacto, accion_sugerida]
    );
    return { id: result.insertId, ...data };
  },

  update: async (id: number, data: Partial<Recomendacion>): Promise<Recomendacion | null> => {
    const current = await RecomendacionModel.getById(id);
    if (!current) return null;

    const updated = { ...current, ...data };
    await pool.query(
      'UPDATE recomendaciones SET titulo = ?, descripcion = ?, categoria_impacto = ?, accion_sugerida = ? WHERE id = ?',
      [updated.titulo, updated.descripcion, updated.categoria_impacto, updated.accion_sugerida, id]
    );
    return RecomendacionModel.getById(id);
  },

  delete: async (id: number): Promise<boolean> => {
    const [result]: any = await pool.query('DELETE FROM recomendaciones WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};
