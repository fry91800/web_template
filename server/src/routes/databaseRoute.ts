
import express, { Router, Request, Response, NextFunction } from 'express';
import { Database, DatabaseConfig, TableInfo } from '../interfaces/database.interface';
import sequelize from '../database/database';
import logger from '../config/logger';
import * as databaseService from '../services/databaseService';
import upload from '../config/multer';
const router = Router();

// All database
router.get('/read', async (req: express.Request, res: express.Response, next) => {
  try {
    const databaseInfo: Database = await databaseService.getDatabaseInfo();
    const responseData = {
      config: databaseInfo.config,
      tables: databaseInfo.tables,
    }
    const response: JSendResponse = {
      status: "success",
      data: {database: responseData},
    }
    res.status(200).json(response);
  } catch (err) {
    logger.error(err)
    next(err);
  }
});
router.get('/read/:table', async (req: express.Request, res: express.Response, next) => {
  try {
    const tableInfo: TableInfo = await databaseService.getTableInfo(req.params.table);
    const response: JSendResponse = {
      status: "success",
      data: {table: tableInfo},
    }
    logger.info(response)
    res.status(200).json(response);
  } catch (err) {
    logger.error(err)
    next(err);
  }
});
// Insert Update and Delete
router.post('/write', async (req: express.Request, res: express.Response, next) => {
  try {
    const query: Query = req.body;
    console.log(query)
    const responseData = await databaseService.writeDatabase(query);
    const jSendResponse: JSendResponse = { status: "success", data: responseData };
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
    const table = req.body.table;
    const file = req.file;
    const data = databaseService.fileToQueryData(type, file)
    const query: Query = { type, table, data }
    await databaseService.writeDatabase(query);

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