import express, { Router, Request, Response, NextFunction } from 'express';
import { User } from '../database/models/User';
import { validateRequest } from '../middleware/validateMiddleware';
import { signupSchema, loginSchema } from '../schemas/authSchemas';
import { signup, getLoginTokens } from '../services/authService';
import logger from '../config/logger';

const router = Router();

router.post('/signup', validateRequest(signupSchema), async (req: Request, res: Response, next: NextFunction) => {
  try{
  const { email, pass } = req.body;
  await signup(email, pass);
  return res.status(200).json({ message: 'Signup successful' });
  }
  catch(err){
    logger.error(err)
    next(); 
  }
});
router.post('/login', validateRequest(loginSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, pass } = req.body;
    const {accessToken, refreshToken } = await getLoginTokens(email, pass);
    // Set the access token in an HTTP-only cookie
    res.cookie('access_token', accessToken, {
      httpOnly: true, // Prevent access via JavaScript
      secure: process.env.NODE_ENV === 'prod', // Ensure HTTPS in production
      sameSite: 'strict', // Prevent cross-site requests
      maxAge: 3600000, // Token expiration in milliseconds (1 hour)
    });
    // Set the access token in an HTTP-only cookie
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true, // Prevent access via JavaScript
      secure: process.env.NODE_ENV === 'prod', // Ensure HTTPS in production
      sameSite: 'strict', // Prevent cross-site requests
      maxAge: 30 * 24 * 60 * 60 * 1000 // Refresh token expires in 30 days
    });
    return res.status(200).json({ message: 'Login successful' });
  }
  catch (err) {
    logger.error(err)
    next();
  }

});

router.post('/logout', (req, res, next) => {
  try{
    res.clearCookie('access_token', { httpOnly: true, secure: process.env.NODE_ENV === 'production' }); // For access token
    res.clearCookie('refresh_token', { httpOnly: true, secure: process.env.NODE_ENV === 'production' }); // For refresh token
    res.status(200).json({ message: 'Logged out successfully' });
  }

  catch(err){
    logger.error(err)
    next();
  }
});

export default router;