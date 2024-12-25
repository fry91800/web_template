
import express, { Router, Request, Response, NextFunction } from 'express';
import { Database, DatabaseConfig, TableInfo } from '../interfaces/database.interface';
import sequelize from '../database/database';
import logger from '../config/logger';
import * as databaseService from '../services/databaseService';
import upload from '../config/multer';
const router = Router();

// Get all database info
router.get('/', async (req: express.Request, res: express.Response, next) => {
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

router.get('/table/:table', async (req: express.Request, res: express.Response, next) => {
  try {
    const tableInfo: TableInfo = await databaseService.getTableInfo(req.params.table);
    const response: JSendResponse = {
      status: "success",
      data: tableInfo,
    }
    res.status(200).json(response);
  } catch (err) {
    logger.error(err)
    next(err);
  }
});
router.post('/table/:table', async (req: express.Request, res: express.Response, next) => {
  try {
    const object= req.body;
    const query: Query = {
      type: "insert",
      table: req.params.table,
      data: object
    }
    const responseData = await databaseService.insert(query);
    const jSendResponse: JSendResponse = { status: "success", data: responseData };
    return res
      .status(200)
      .json(jSendResponse);
  } catch (err) {
    logger.error(err)
    next(err);
  }
});
router.patch('/table/:table', async (req: express.Request, res: express.Response, next) => {
  try {
    const update = req.body;
    const query: Query = {
      type: "update",
      table: req.params.table,
      data: update
    }
    const responseData = await databaseService.update(query);
    const jSendResponse: JSendResponse = { status: "success", data: responseData };
    return res
      .status(200)
      .json(jSendResponse);
  } catch (err) {
    logger.error(err)
    next(err);
  }
});
router.delete('/table/:table', async (req: express.Request, res: express.Response, next) => {
  try {
    const update = req.body;
    const query: Query = {
      type: "delete",
      table: req.params.table,
      data: update
    }
    const responseData = await databaseService.remove(query);
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
    const data = databaseService.fileToQueryData("insert", file)
    const query: Query = { type, table, data }
    const response = await databaseService.insertMany(query);

    const jSendResponse: JSendResponse = { status: "success", data: response };
    return res
      .status(200)
      .json(jSendResponse);
  }
  catch (err) {
    logger.error(err)
    next(err);
  }
});


// DEPRECATED
// router.post('/write', async (req: express.Request, res: express.Response, next) => {
//   try {
//     const query: Query = req.body;
//     const responseData = await databaseService.writeDatabase(query);
//     const jSendResponse: JSendResponse = { status: "success", data: responseData };
//     return res
//       .status(200)
//       .json(jSendResponse);
//   } catch (err) {
//     logger.error(err)
//     next(err);
//   }
// });

export default router;