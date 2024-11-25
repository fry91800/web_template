import dotenv from 'dotenv'
//const envFile = process.env.NODE_ENV === 'prod' ? '.env.prod' : '.env.dev';
//dotenv.config({ path: envFile });
import express, { Request, Response, NextFunction, Application } from 'express';
import cookieParser from 'cookie-parser';
import logger from './config/logger';
import { requestLogger } from './middleware/requestMiddleware';
import { authenticate } from './middleware/authMiddleware';
import sequelize from './database/database';
import { User } from './database/models/User';

// Routes
import databaseRouter from './routes/database';
import authRouter from './routes/auth';
import protectedRouter from './routes/protectedRoute';

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Request Logger Middleware
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

// Error-Handling Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // Log the error
  logger.error(`Error ${err.status}: ${err.message}`);

  // Determine status code and error message
  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';

  // Respond to the client
  res.status(statusCode).json({
    status: "error"
  });
});

// Start the server only if not in test mode (in that case the server is started by the test)
if (process.env.NODE_ENV !== 'test') {
  app.listen(3001, () => {
    logger.info(`Server listening on http://localhost:3001 (${process.env.NODE_ENV})`);
  });
}

export default app;
