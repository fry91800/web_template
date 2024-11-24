import express, { Request, Response } from 'express';

const router = express.Router();

// A protected route that requires JWT authentication
router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'This is a protected route', user: req.session });
});

export default router;
