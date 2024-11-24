import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger'; // Adjust the path to your logger module

// Middleware function to log requests
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  logger.info(`Incoming request: ${req.method} ${req.url}`);
  next();
};