import pool from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export interface Usuario {
  id?: number;
  nombre: string;
  apellido: string;
  email: string;
  password_hash?: string;
  password?: string; // Para recibir la contraseña plana desde el body
  rol_id?: number;
  rol_nombre?: string;
  puntuacion_ambiental?: number;
  fecha_registro?: Date;
}

export class UsuarioModel {
  static async findByCorreo(email: string): Promise<Usuario | null> {
    const query = `
      SELECT u.id, u.nombre, u.apellido, u.email, u.password_hash, u.rol_id, u.puntuacion_ambiental, u.fecha_registro, r.nombre AS rol_nombre 
      FROM usuarios u
      JOIN roles r ON u.rol_id = r.id
      WHERE u.email = ?
    `;
    const [rows] = await pool.query<RowDataPacket[]>(query, [email]);
    if (rows.length === 0) return null;
    return rows[0] as Usuario;
  }

  static async findById(id: number): Promise<Usuario | null> {
    const query = `
      SELECT u.id, u.nombre, u.apellido, u.email, u.rol_id, u.puntuacion_ambiental, u.fecha_registro, r.nombre AS rol_nombre 
      FROM usuarios u
      JOIN roles r ON u.rol_id = r.id
      WHERE u.id = ?
    `;
    const [rows] = await pool.query<RowDataPacket[]>(query, [id]);
    if (rows.length === 0) return null;
    return rows[0] as Usuario;
  }

  static async create(data: { nombre: string; apellido: string; email: string; password_hash: string; rol_id?: number }): Promise<Usuario> {
    const { nombre, apellido, email, password_hash, rol_id } = data;
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO usuarios (nombre, apellido, email, password_hash, rol_id) VALUES (?, ?, ?, ?, ?)',
      [nombre, apellido, email, password_hash, rol_id || 2]
    );
    return { id: result.insertId, nombre, apellido, email, rol_id: rol_id || 2 };
  }
}