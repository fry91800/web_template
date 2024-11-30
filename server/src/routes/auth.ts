import express, { Router, Request, Response, NextFunction } from 'express';
import { User } from '../database/models/User';
import { validateRequest } from '../middleware/validateMiddleware';
import { signupSchema, loginSchema } from '../schemas/authSchemas';
import { signup, getLoginTokens } from '../services/authService';
import logger from '../config/logger';
import { UserCredentials, UserSignUpData } from '../types/user'

const router = Router();

// Sign up Endpoint
router.post('/signup', validateRequest(signupSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userSignUpData: UserSignUpData = { email: req.body.email, pass: req.body.pass }
    const newUser = await signup(userSignUpData);
    const jSendResponse: JSendResponse = {status: "success", data: newUser};
    return res
      .status(201)
      .json(jSendResponse);
  }
  catch (err) {
    next(err);
  }
});

// Log in Middleware
router.post('/login', validateRequest(loginSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, pass } = req.body;
    const { accessToken, refreshToken } = await getLoginTokens(email, pass);
    // Set the access token
    const accessTokenMaxAge = parseInt(process.env.ACCESS_TOKEN_MAX_AGE || '3600000', 10);
    res.cookie('access_token', accessToken, {
      httpOnly: true, // Prevent access via JavaScript
      secure: process.env.NODE_ENV === 'prod', // Ensure HTTPS in production
      sameSite: 'strict', // Prevent cross-site requests
      maxAge: accessTokenMaxAge, // Token expiration in milliseconds (1 hour)
    });
    // Set the refresh token
    const refreshTokenMaxAge = parseInt(process.env.REFRESH_TOKEN_MAX_AGE || '2592000000', 10);
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true, // Prevent access via JavaScript
      secure: process.env.NODE_ENV === 'prod', // Ensure HTTPS in production
      sameSite: 'strict', // Prevent cross-site requests
      maxAge: 2592000000 // Refresh token expires in 30 days
    });
    logger.info("Log in: OK")
    return res.status(200).json({ message: 'Logged in successfully' });
  }
  catch (err) {
    logger.error(err)
    next();
  }

});

router.post('/logout', (req, res, next) => {
  try {
    res.clearCookie('access_token', { httpOnly: true, secure: process.env.NODE_ENV === 'prod' }); // For access token
    res.clearCookie('refresh_token', { httpOnly: true, secure: process.env.NODE_ENV === 'prod' }); // For refresh token
    res.status(200).json({ message: 'Logged out successfully' });
    logger.info("Logout: OK")
  }

  catch (err) {
    logger.error(err)
    next();
  }
});

export default router;