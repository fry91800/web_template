import express, { Request, Response } from 'express';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = express.Router();

// A protected route that requires JWT authentication
router.get('/', authenticateJWT, (req: Request, res: Response) => {
  res.json({ message: 'This is a protected route', user: req.session });
});

export default router;
