
import express, { Router, Request, Response } from 'express';
import { Database, DatabaseConfig, TableInfo } from '../interfaces/database.interface'; 
import sequelize from '../database/database';
import logger from '../config/logger';
import * as databaseService from '../services/databaseService';
const router = Router();

// Endpoint to retrieve all of the database
router.get('/', async (req: express.Request, res: express.Response) => {
  try {
    const databaseInfo: Database = await databaseService.getDatabaseInfo();
    const response = {
      config: databaseInfo.config,
      tables: databaseInfo.tables,
    }
    res.json(response);
  } catch (err) {
    logger.error(err)
  }
});

export default router;