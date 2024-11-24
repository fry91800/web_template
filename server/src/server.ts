import dotenv from 'dotenv'
const envFile = process.env.NODE_ENV === 'prod' ? '.env.prod' : '.env.dev';
dotenv.config({ path: envFile });
import express, { Request, Response, Application } from 'express';
import cookieParser from 'cookie-parser';
import logger from './config/logger';
import { requestLogger } from './middleware/requestMiddleware';
import { authenticate } from './middleware/authMiddleware';

import sequelize from './database/database';
import { User } from './database/models/User';
import databaseRouter from './routes/database';
import authRouter from './routes/auth';
import protectedRouter from './routes/protectedRoute';

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Request Logger
app.use(requestLogger);

// Auth Middleware
app.use(authenticate);


// Root Endpoint
app.get('/', async (req: Request, res: Response) => {
  res.send("Welcome to Web Template backend !")
  return
});

// Other routes
app.use('/database', databaseRouter); // Mount the router at the `/database` path
app.use('/auth', authRouter);
app.use('/protecc', protectedRouter);



// Start the server
app.listen(3001, () => {
  logger.info('Server listening on http://localhost:3001');
});

export default app;
