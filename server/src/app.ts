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
import cors from 'cors';

// Routes
import databaseRouter from './routes/databaseRoute';
import authRouter from './routes/authRoute';
import protectedRouter from './routes/protectedRoute';

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Log cookies immediately after cookie-parser
app.use((req, res, next) => {
  console.log("Cookies after cookie-parser:", req.cookies);
  next();
});
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from this origin
  credentials: true, // Allow credentials (cookies)
}));

app.use((req, res, next) => {
  console.log("Cookies after cookie-parser:", req.cookies);
  next();
});
// Request Logger Middleware
app.use(requestLogger);
app.use((req, res, next) => {
  console.log("Cookies after cookie-parser:", req.cookies);
  next();
});
// Auth Middleware
app.use(authenticate);
app.use((req, res, next) => {
  console.log("Cookies after cookie-parser:", req.cookies);
  next();
});

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
  logger.error(err);
  if (err.status === 'fail')
  {
    const jSendResponse = {status: err.status, data: err.data}
    return res.status(err.statusCode).json(jSendResponse);
  }

  // Determine status code and error message
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  const jSendResponse = {status: 'error', message: message, code: statusCode}
  // Respond to the client
  res.status(statusCode).json(jSendResponse);
});

// Start the server only if not in test mode (in that case the server is started by the test)
if (process.env.NODE_ENV !== 'test') {
  app.listen(3001, '0.0.0.0', () => {
    logger.info(`Server listening on http://0.0.0.0:3001 (${process.env.NODE_ENV})`);
});
}

export default app;
