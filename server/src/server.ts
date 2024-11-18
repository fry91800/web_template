import dotenv from 'dotenv'
const envFile = process.env.NODE_ENV === 'prod' ? '.env.prod' : '.env.dev';
dotenv.config({ path: envFile, debug: true });
import express, { Request, Response, Application } from 'express';
import logger from './config/logger';
import sequelize from './database';
import { User } from './database/models/User';

const app: Application = express();

app.use(express.json());

// Request Logger Middleware
app.use((req: Request, res: Response, next) => {
  logger.info(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Root Endpoint
app.get('/', async (req: Request, res: Response) => {
  console.log('DB Credentials:', process.env.NODE_ENV, process.env.DB_PASS);

  // Authenticate and sync the Sequelize instance
  await sequelize.authenticate();
  console.log('Database connected!');

  // Optionally, sync models (ensure tables exist)
  await sequelize.sync();
  await User.create({ name: 'En GAYZOU' });
  const test = await User.findAll();
  res.json(test)
  return
  logger.debug('Serving root endpoint');
  res.status(200).send(`App running on ${process.env.NODE_ENV}`);
});

// Data Endpoint
app.get('/data', (req: Request, res: Response) => {
  logger.debug('Serving /data endpoint');
  res.json({ name: "John" });
});


// Start the server
app.listen(3001, () => {
  logger.info('Server listening on http://localhost:3001');
});

export default app;
