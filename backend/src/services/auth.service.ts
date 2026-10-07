import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UsuarioModel } from '../models/usuario.model';

export class AuthService {
  static async register(data: {
    nombre: string;
    apellido: string;
    email?: string;
    correo?: string;
    password: string;
    rol_id?: number;
  }) {
    const email = (data.email || data.correo || '').trim();
    const nombre = data.nombre?.trim();
    const apellido = data.apellido?.trim();
    const password = data.password;

    if (!email || !nombre || !apellido || !password) {
      const error: any = new Error('Nombre, apellido, email y password son obligatorios');
      error.statusCode = 400;
      throw error;
    }

    const usuarioExistente = await UsuarioModel.findByCorreo(email);
    if (usuarioExistente) {
      const error: any = new Error('El correo ya está registrado');
      error.statusCode = 409;
      throw error;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const usuario = await UsuarioModel.create({
      nombre,
      apellido,
      email,
      password_hash: passwordHash,
      rol_id: data.rol_id || 2
    });

    const token = jwt.sign(
      { id: usuario.id, correo: usuario.email, rol: 'USER' },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '1d' }
    );

    return {
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: 'USER'
      }
    };
  }

  static async login(correo: string, password: string) {
    const email = correo?.trim();
    if (!email || !password) {
      const error: any = new Error('Correo y contraseña son obligatorios');
      error.statusCode = 400;
      throw error;
    }

    const usuario = await UsuarioModel.findByCorreo(email);
    if (!usuario || !usuario.password_hash) {
      const error: any = new Error('Credenciales inválidas');
      error.statusCode = 401;
      throw error;
    }

    const passwordValida = await bcrypt.compare(password, usuario.password_hash);
    if (!passwordValida) {
      const error: any = new Error('Credenciales inválidas');
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      { id: usuario.id, correo: usuario.email, rol: usuario.rol_nombre || 'USER' },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '1d' }
    );

    return {
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol_nombre || 'USER'
      }
    };
  }
}