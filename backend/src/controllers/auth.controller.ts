import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../middlewares/auth.middleware';
import { UsuarioModel } from '../models/usuario.model';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const data = await AuthService.register(req.body);
      return sendSuccess(res, data, 'Usuario registrado exitosamente', 201);
    } catch (error: any) {
      return sendError(res, error.message, error.statusCode || 400);
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { correo, password } = req.body;
      const data = await AuthService.login(correo, password);
      return sendSuccess(res, data, 'Inicio de sesión exitoso');
    } catch (error: any) {
      return sendError(res, error.message, 401);
    }
  }

  static async getProfile(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return sendError(res, 'No autenticado', 401);
      }
      const usuario = await UsuarioModel.findById(req.user.id);
      return sendSuccess(res, usuario, 'Perfil obtenido correctamente');
    } catch (error: any) {
      return sendError(res, error.message, 500);
    }
  }
}