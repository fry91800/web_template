import express, { Router, Request, Response, NextFunction } from 'express';
import { User } from '../database/models/User';
import { validateRequest } from '../middleware/validateMiddleware';
import { signupSchema, loginSchema } from '../schemas/authSchemas';
import { signup, getLoginTokens } from '../services/authService';
import { uploadFromFile } from '../services/fileService';
import logger from '../config/logger';
import { UserCredentials, UserSignUpData } from '../types/user';
import upload from '../config/multer';
import {Failure} from '../types/failure'

const router = Router();

router.post('/upload', upload.single('file'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const type = req.body.type;
        const file = req.file;
        await uploadFromFile(type, file);
    
        const jSendResponse: JSendResponse = { status: "success", data: {} };
        return res
          .status(200)
          .json(jSendResponse);
    }
    catch (err) {
      next(err);
    }
  });

  export default router;