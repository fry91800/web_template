import express, { Router, Request, Response } from 'express';
import { User } from '../database/models/User';
import { generateToken } from '../utils/jwt';

const router = Router();

router.post('/signup', (req: Request, res: Response): Response => {
  const {email, pass} = req.body;
  if (!email) {
    // Explicitly return the response in case of a missing userId
    return res.status(400).json({ message: 'email is required' });
  }
  if (!pass) {
    // Explicitly return the response in case of a missing userId
    return res.status(400).json({ message: 'pass is required' });
  }
  const newUser = {email, pass}
  console.log("creating user");
  User.create(newUser);
  return res.status(200).json({ message: 'Signup successful'});
});
// Sample route to simulate user login and return JWT
router.post('/login', (req: Request, res: Response): Response => {
  const {email, pass} = req.body;
  if (!email) {
    // Explicitly return the response in case of a missing userId
    return res.status(400).json({ message: 'email is required' });
  }
  if (!pass) {
    // Explicitly return the response in case of a missing userId
    return res.status(400).json({ message: 'pass is required' });
  }
  const token = generateToken(email); // Generate JWT for the user

    // Set the token in an HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true, // Prevent access via JavaScript
      secure: process.env.NODE_ENV === 'prod', // Ensure HTTPS in production
      sameSite: 'strict', // Prevent cross-site requests
      maxAge: 3600000, // Token expiration in milliseconds (1 hour)
    });

  return res.status(200).json({ message: 'Login successful', token });
});

export default router;