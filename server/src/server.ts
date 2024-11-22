import dotenv from 'dotenv'
const envFile = process.env.NODE_ENV === 'prod' ? '.env.prod' : '.env.dev';
dotenv.config({ path: envFile});
import express, { Request, Response, Application } from 'express';
import logger from './config/logger';
import sequelize from './database/database';
import { User } from './database/models/User';
import databaseRouter from './routes/database';
import authRouter from './routes/authRoutes';
import protectedRouter from './routes/protectedRoute';

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Request Logger Middleware
app.use((req: Request, res: Response, next) => {
  logger.info(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Root Endpoint
app.get('/', async (req: Request, res: Response) => {
  console.log('Database connected!');

  // Optionally, sync models (ensure tables exist)
  await sequelize.sync();
  await User.create({ name: 'En GAYZOU' });
  const test = await User.findAll();
  res.json(test)
  return
});

app.use('/database', databaseRouter); // Mount the router at the `/database` path
app.use('/auth', authRouter);
app.use('/protecc', protectedRouter);



// Start the server
app.listen(3001, () => {
  logger.info('Server listening on http://localhost:3001');
});

export default app;
