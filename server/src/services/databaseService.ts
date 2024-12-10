import express, { Router, Request, Response } from 'express';
import sequelize from '../database/database';
import { Database, DatabaseConfig, TableInfo } from '../interfaces/database.interface';  // Import the interfaces
import logger from '../config/logger';
import { getTablesInfo } from '../utils/database'
import { Sequelize, Model, ModelStatic } from 'sequelize';
import {Failure} from '../types/failure'


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


export async function writeDatabase(query: Query): Promise<void> {
  const { type, table } = query;
  const model = getModel(table);

  switch (type) {
    case 'insert': {
      const { data } = query;
      await model.create(data);
      logger.info(`Inserted data into ${table}`);
      break;
    }

    case 'update': {
      const { where, data } = query;
      await model.update(data, { where });
      logger.info(`Updated data in ${table} where`, where);
      break;
    }

    case 'delete': {
      const { where } = query;
      await model.destroy({ where });
      logger.info(`Deleted data from ${table} where`, where);
      break;
    }

    default:
      throw new Failure(400, "Query type doesn't exist", { "type": "Query type doesn't exist"});
  }
}
// Helper function to get the model by table name
function getModel(table: string): ModelStatic<Model> {
  const model = sequelize.models[table];
  if (!model) {
    throw new Failure(400, "Table doesn't exist", { "table": "Table doesn't exist"});
  }
  return model;
}

