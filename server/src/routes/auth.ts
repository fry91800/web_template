import express, { Router, Request, Response } from 'express';
import { User } from '../database/models/User';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';

const router = Router();

router.post('/signup', (req: Request, res: Response): Response => {
  const { email, pass } = req.body;
  if (!email) {
    // Explicitly return the response in case of a missing userId
    return res.status(400).json({ message: 'email is required' });
  }
  if (!pass) {
    // Explicitly return the response in case of a missing userId
    return res.status(400).json({ message: 'pass is required' });
  }
  const newUser = { email, pass }
  User.create(newUser);
  return res.status(200).json({ message: 'Signup successful' });
});
// Sample route to simulate user login and return JWT
router.post('/login', async (req: Request, res: Response): Promise<express.Response<any, Record<string, any>>> => {
  const { email, pass } = req.body;
  if (!email) {
    // Explicitly return the response in case of a missing userId
    return res.status(400).json({ message: 'email is required' });
  }
  if (!pass) {
    // Explicitly return the response in case of a missing userId
    return res.status(400).json({ message: 'pass is required' });
  }
  const user = await User.findOne({
    where: { email: email }
  });
  if (!user)
  {
    return res.status(400).json({ message: 'Mail no exist' });
  }

  if (!await user.comparePassword(pass)) {
    return res.status(400).json({ message: 'wrong pass' });
  }
  const userId = user.id;
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);
  // Set the token in an HTTP-only cookie
  res.cookie('access_token', accessToken, {
    httpOnly: true, // Prevent access via JavaScript
    secure: process.env.NODE_ENV === 'prod', // Ensure HTTPS in production
    sameSite: 'strict', // Prevent cross-site requests
    maxAge: 3600000, // Token expiration in milliseconds (1 hour)
  });
  // Set the token in an HTTP-only cookie
  res.cookie('refresh_token', refreshToken, {
    httpOnly: true, // Prevent access via JavaScript
    secure: process.env.NODE_ENV === 'prod', // Ensure HTTPS in production
    sameSite: 'strict', // Prevent cross-site requests
    maxAge: 30 * 24 * 60 * 60 * 1000 // Refresh token expires in 30 days
  });

  return res.status(200).json({ message: 'Login successful' });
});

router.post('/logout', (req, res) => {
  // Remove the access token and refresh token from cookies
  res.clearCookie('access_token', { httpOnly: true, secure: process.env.NODE_ENV === 'production' }); // For access token
  res.clearCookie('refresh_token', { httpOnly: true, secure: process.env.NODE_ENV === 'production' }); // For refresh token

  // Optionally, respond with a success message
  res.status(200).json({ message: 'Logged out successfully' });
});

export default router;