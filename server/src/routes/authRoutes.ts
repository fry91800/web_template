import express, { Router, Request, Response } from 'express';
import { generateToken } from '../utils/jwt';

const router = Router();

// Sample route to simulate user login and return JWT
router.post('/login', (req: Request, res: Response): Response => {
  const { userId } = req.body;

  if (!userId) {
    // Explicitly return the response in case of a missing userId
    return res.status(400).json({ message: 'User ID is required' });
  }

  const token = generateToken(userId); // Generate JWT for the user
  return res.json({ token });
});

export default router;