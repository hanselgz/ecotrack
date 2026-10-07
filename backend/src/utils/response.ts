import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T | null;
}

export const sendSuccess = <T>(res: Response, data: T, message: string = 'Operación realizada correctamente', statusCode: number = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  } as ApiResponse<T>);
};

export const sendError = (res: Response, message: string = 'Ha ocurrido un error', statusCode: number = 500, data: any = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    data
  } as ApiResponse);
};