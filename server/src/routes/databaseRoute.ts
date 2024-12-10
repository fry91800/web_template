
import express, { Router, Request, Response } from 'express';
import { Database, DatabaseConfig, TableInfo } from '../interfaces/database.interface'; 
import sequelize from '../database/database';
import logger from '../config/logger';
import * as databaseService from '../services/databaseService';
const router = Router();

// Endpoint to retrieve database config and content
router.get('/read', async (req: express.Request, res: express.Response, next) => {
  try {
    const databaseInfo: Database = await databaseService.getDatabaseInfo();
    const response = {
      config: databaseInfo.config,
      tables: databaseInfo.tables,
    }
    res.json(response);
  } catch (err) {
    logger.error(err)
    next(err);
  }
});
// Endpoint to modify database content
router.post('/write', async (req: express.Request, res: express.Response, next) => {
  try {
    const query= req.body;
    console.log(req.body)
    await databaseService.writeDatabase(query);
    const jSendResponse: JSendResponse = {status: "success", data: {}};
    return res
      .status(200)
      .json(jSendResponse);
  } catch (err) {
    logger.error(err)
    next(err);
  }
});

export default router;