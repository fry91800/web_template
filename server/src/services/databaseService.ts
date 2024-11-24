import express, { Router, Request, Response } from 'express';
import sequelize from '../database/database';
import { Database, DatabaseConfig, TableInfo } from '../interfaces/database.interface';  // Import the interfaces
import logger from '../config/logger';
import { getTablesInfo } from '../utils/database'
export async function getDatabaseInfo() {
  // Step 1: Get each table information
  const tables: TableInfo[] = await getTablesInfo();
  // Step 2: Get the whole database information
  const databaseInfo = {
    sequelize,
    config: {
      host: sequelize.config.host,
      database: sequelize.config.database,
      username: sequelize.config.username,
      port: sequelize.config.port,
    },
    queryInterface: sequelize.getQueryInterface(),
    tables: tables,
  };
  return databaseInfo;
}