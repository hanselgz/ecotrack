import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(
    '[Error Handler] ' + req.method + ' ' + req.url + ' - Error:',
    err.message || err
  );

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Ha ocurrido un error interno en el servidor';

  return sendError(res, message, statusCode);
};
