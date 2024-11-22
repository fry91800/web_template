
import express, {Router, Request, Response} from 'express';
import { Database, DatabaseConfig, TableInfo } from '../interfaces/database.interface';  // Import the interfaces
import sequelize from '../database/database';
import logger from '../config/logger';
import * as databaseService from '../services/databaseService';
const router = Router();
router.get('/', async (req: Request, res: Response) => {
  try{
    const databaseInfo: Database = await databaseService.getDatabaseInfo();
    const response = {
      config: databaseInfo.config,  // Only send relevant config info
      tables: databaseInfo.tables,  // Send table info
    }
    res.json(response);
  }
  catch(err){
    console.log(err)
    //logger.error(err)
  }
  });

  export default router;