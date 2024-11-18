const express = require('express');
import { Request, Response, Application } from 'express';
// Declare a custom type to extend the Request interface
/*
declare global {
  namespace Express {
    interface Request {
      locals?: Record<string, any>;  // Locals property to hold custom data
      jtbz?: string;
    }
  }
}*/
// Import the dotenv package
const dotenv = require('dotenv');

// Load the appropriate .env file based on the NODE_ENV variable
if (process.env.NODE_ENV === 'prod') {
  dotenv.config({ path: '../.env.prod' });
} else{
  dotenv.config({ path: '../.env.dev' });
}
const app: Application = express();

const dev = process.env.NODE_ENV !== 'production';

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.status(200).send(`App running on ${process.env.NODE_ENV}`);
});
app.get('/data', (req: Request, res: Response) => {
  res.json({name: "John"});
});
app.listen(3001, () => {
  console.log('Server listening on http://localhost:3001');
});
export default app;  // Make sure you're exporting the Express app