import pool from '../config/db';

export interface UbicacionInput {
  departamento: string;
  municipio: string;
  direccion?: string;
  referencia?: string;
  latitud: number;
  longitud: number;
}

export interface ReporteAmbientalInput {
  titulo: string;
  descripcion: string;
  fotografia?: string;
  estado?: 'pendiente' | 'en revision' | 'verificado' | 'resuelto' | 'rechazado';
  nivel_impacto?: 'bajo' | 'medio' | 'alto' | 'critico';
  observaciones_evaluacion?: string;
  usuario_id: number;
  categoria_id: number;
  ubicacion: UbicacionInput;
}

export const ReporteAmbientalModel = {
  getAll: async () => {
    const query = 'SELECT ' +
      'r.id, r.titulo, r.descripcion, r.fotografia, r.estado, r.nivel_impacto, r.observaciones_evaluacion, ' +
      'r.fecha_creacion, r.fecha_actualizacion, ' +
      'c.id AS categoria_id, c.nombre AS categoria_nombre, c.icono AS categoria_icono, ' +
      'u.id AS usuario_id, u.nombre AS usuario_nombre, u.apellido AS usuario_apellido, u.email AS usuario_email, ' +
      'ub.id AS ubicacion_id, ub.departamento, ub.municipio, ub.direccion, ub.referencia, ub.latitud, ub.longitud ' +
      'FROM reportes_ambientales r ' +
      'INNER JOIN categorias_reporte c ON r.categoria_id = c.id ' +
      'INNER JOIN usuarios u ON r.usuario_id = u.id ' +
      'INNER JOIN ubicaciones ub ON r.ubicacion_id = ub.id ' +
      'ORDER BY r.fecha_creacion DESC';

    const [rows]: any = await pool.query(query);
    return rows;
  },

  getById: async (id: number) => {
    const query = 'SELECT ' +
      'r.id, r.titulo, r.descripcion, r.fotografia, r.estado, r.nivel_impacto, r.observaciones_evaluacion, ' +
      'r.fecha_creacion, r.fecha_actualizacion, ' +
      'c.id AS categoria_id, c.nombre AS categoria_nombre, c.icono AS categoria_icono, ' +
      'u.id AS usuario_id, u.nombre AS usuario_nombre, u.apellido AS usuario_apellido, u.email AS usuario_email, ' +
      'ub.id AS ubicacion_id, ub.departamento, ub.municipio, ub.direccion, ub.referencia, ub.latitud, ub.longitud ' +
      'FROM reportes_ambientales r ' +
      'INNER JOIN categorias_reporte c ON r.categoria_id = c.id ' +
      'INNER JOIN usuarios u ON r.usuario_id = u.id ' +
      'INNER JOIN ubicaciones ub ON r.ubicacion_id = ub.id ' +
      'WHERE r.id = ?';

    const [rows]: any = await pool.query(query, [id]);
    if (rows.length === 0) return null;
    return rows[0];
  },

  create: async (data: ReporteAmbientalInput) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Insertar Ubicacion
      const { departamento, municipio, direccion, referencia, latitud, longitud } = data.ubicacion;
      const [ubResult]: any = await connection.query(
        'INSERT INTO ubicaciones (departamento, municipio, direccion, referencia, latitud, longitud) VALUES (?, ?, ?, ?, ?, ?)',
        [departamento, municipio, direccion || null, referencia || null, latitud, longitud]
      );
      const ubicacionId = ubResult.insertId;

      // 2. Insertar Reporte Ambiental
      const { titulo, descripcion, fotografia, estado, nivel_impacto, observaciones_evaluacion, usuario_id, categoria_id } = data;
      const [repResult]: any = await connection.query(
        'INSERT INTO reportes_ambientales (titulo, descripcion, fotografia, estado, nivel_impacto, observaciones_evaluacion, usuario_id, categoria_id, ubicacion_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [titulo, descripcion, fotografia || null, estado || 'pendiente', nivel_impacto || 'bajo', observaciones_evaluacion || null, usuario_id, categoria_id, ubicacionId]
      );

      await connection.commit();
      return { id: repResult.insertId, ...data };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  updateStatus: async (id: number, estado: string) => {
    await pool.query(
      'UPDATE reportes_ambientales SET estado = ? WHERE id = ?',
      [estado, id]
    );
    return ReporteAmbientalModel.getById(id);
  },

  delete: async (id: number) => {
    const [result]: any = await pool.query('DELETE FROM reportes_ambientales WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  getEstadisticas: async () => {
    const [totalRow]: any = await pool.query('SELECT COUNT(*) as total FROM reportes_ambientales');
    const [estadosRows]: any = await pool.query(
      'SELECT estado, COUNT(*) as cantidad FROM reportes_ambientales GROUP BY estado'
    );
    const [categoriasRows]: any = await pool.query(
      `SELECT c.nombre, COUNT(r.id) as cantidad 
       FROM categorias_reporte c 
       LEFT JOIN reportes_ambientales r ON c.id = r.categoria_id 
       GROUP BY c.id, c.nombre`
    );

    return {
      total_reportes: totalRow[0]?.total || 0,
      por_estado: estadosRows,
      por_categoria: categoriasRows
    };
  },

  evaluarImpacto: async (id: number, nivelImpacto: string, observaciones: string) => {
    const query = `
      UPDATE reportes_ambientales 
      SET nivel_impacto = ?, observaciones_evaluacion = ? 
      WHERE id = ?
    `;
    await pool.query(query, [nivelImpacto, observaciones, id]);
    return ReporteAmbientalModel.getById(id);
  }
};