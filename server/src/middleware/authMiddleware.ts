import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

// Middleware to protect routes by checking for a valid JWT
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Get token from Authorization header

  if (!token) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  // Attach user info to request object for downstream use
  req.body.user = decoded; // You can define req.user type if necessary
  next();
};
