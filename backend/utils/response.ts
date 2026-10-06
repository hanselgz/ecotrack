import { Response } from 'express';

export const sendSuccess = (res: Response, message: string, data: any = null, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

export const sendError = (res: Response, message: string, statusCode = 500, errorData: any = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    data: errorData
  });
};