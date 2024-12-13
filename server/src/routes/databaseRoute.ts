
import express, { Router, Request, Response, NextFunction } from 'express';
import { Database, DatabaseConfig, TableInfo } from '../interfaces/database.interface'; 
import sequelize from '../database/database';
import logger from '../config/logger';
import * as databaseService from '../services/databaseService';
import upload from '../config/multer';
const router = Router();

// Retrieve all
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
// Insert Update and Delete
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


router.post('/upload', upload.single('file'), async (req: Request, res: Response, next: NextFunction) => {
  try {
      const type = req.body.type;
      const file = req.file;
      await databaseService.uploadFromFile(type, file);
  
      const jSendResponse: JSendResponse = { status: "success", data: {} };
      return res
        .status(200)
        .json(jSendResponse);
  }
  catch (err) {
    next(err);
  }
});

export default router;