import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { sendError } from '../utils/response';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    correo: string;
    rol: string;
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

  if (!token) {
    return sendError(res, 'Acceso denegado. No se proporcionó un token.', 401);
  }

  try {
    const secret = process.env.JWT_SECRET || 'secret_key';
    const decoded = jwt.verify(token, secret) as any;
    req.user = decoded;
    next();
  } catch (error) {
    return sendError(res, 'Token inválido o expirado.', 403);
  }
};

export const authorizeRoles = (...rolesPermitidos: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 'No autenticado.', 401);
    }

    if (!rolesPermitidos.includes(req.user.rol)) {
      return sendError(res, 'No tienes permisos suficientes para realizar esta acción.', 403);
    }

    next();
  };
};