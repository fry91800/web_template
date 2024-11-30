import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';
import logger from '../config/logger'

export const validateRequest =
  (schema: ZodSchema) =>
    (req: Request, res: Response, next: NextFunction): void | Response => {
      const validationResult = schema.safeParse(req.body);

      if (!validationResult.success) {
        // errors : {email: "not a mail", ...}
        const errors: Record<string, string> = {};
        validationResult.error.errors.forEach((error) => {
          const field = error.path.join('.');
          errors[field] = error.message;
        });
        const jSendResponse: JSendResponse = {
          status: "fail",
          data: errors
        }
        return res.status(400).json(jSendResponse);
      }
      // Attach validated data to the request object for further use
      req.validatedBody = validationResult.data;
      next();
    };
