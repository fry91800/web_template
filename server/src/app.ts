import dotenv from 'dotenv'
//const envFile = process.env.NODE_ENV === 'prod' ? '.env.prod' : '.env.dev';
//dotenv.config({ path: envFile });
import express, { Request, Response, NextFunction, Application } from 'express';
import cookieParser from 'cookie-parser';
import logger from './config/logger';
import { requestLogger } from './middleware/requestMiddleware';
import { authenticate } from './middleware/authMiddleware';
import sequelize from './database/database';
import rateLimit from './middleware/rateLimitMiddleware';
import cors from 'cors';
import i18n from 'i18n';

// Routes
import databaseRouter from './routes/databaseRoute';
import authRouter from './routes/authRoute';
import protectedRouter from './routes/protectedRoute';

i18n.configure({
  locales:['fr', 'en'], 
  directory: __dirname + '/locales', 
  defaultLocale: 'en',
  cookie: 'lang'
});


const app: Application = express();
// Middleware to set locale (before translation)
app.use((req, res, next) => {
  i18n.setLocale(req, "en")
  next();
});
app.use(i18n.init);

/* This is to retrieve the ip if behind a proxy, apparently, using
app.set("trust proxy", "loopback"); // Only trusts localhost
app.set("trust proxy", "192.168.0.1"); // Trusts a specific IP
might be better in a real scenario for security, this deserve some
research when needed
*/
if (process.env.NODE_ENV === 'production') {
  app.set("trust proxy", true);
}

app.use(rateLimit({ windowMs: 60000, maxRequests: 10 }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from this origin
  credentials: true, // Allow credentials (cookies)
}));
// Request Logger Middleware
app.use(requestLogger);
// Auth Middleware
app.use(authenticate);

// Root Endpoint
app.get('/', async (req: Request, res: Response) => {
  res.send("Welcome to Web Template backend !")
  return
});

// Message Endpoint to test translations
app.get('/message', async (req: Request, res: Response) => {
  console.log(res.getLocale())
  const message = res.__('message');
  return res.status(200).json(
    {
      status: "success",
      message: message
    }
  )
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
