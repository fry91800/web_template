import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';
import logger from '../config/logger'

export const validateRequest =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void | Response => {
    const validationResult = schema.safeParse(req.body);

    if (!validationResult.success) {
      for (const error of validationResult.error.errors)
      {
        logger.info(`Validation error: ${error.message}`)
      }
      return res.status(400).json({
        message: 'Validation failed',
        errors: validationResult.error.errors,
      });
    }
    // Attach validated data to the request object for further use
    req.body = validationResult.data;
    next();
  };
