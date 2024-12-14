import express, { Router, Request, Response } from 'express';
import sequelize from '../database/database';
import { Database, DatabaseConfig, TableInfo } from '../interfaces/database.interface';  // Import the interfaces
import logger from '../config/logger';
import { getTablesInfo } from '../utils/database'
import { Sequelize, Model, ModelStatic } from 'sequelize';
import { Failure } from '../types/failure'
import fs from 'fs';


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
      await model.bulkCreate(data);
      logger.info(`Inserted data into ${table}`);
      break;
    }

    case 'update': {
      const { data } = query;
      await updateMany(model, data)
      logger.info(`Updated data in ${table}`);
      break;
    }

    case 'delete': {
      const { data } = query;
      await deleteMany(model, data)
      logger.info(`Deleted data from ${table}`);
      break;
    }

    default:
      throw new Failure(400, "Query type doesn't exist", { "type": "Query type doesn't exist" });
  }
}
// Helper function to get the model by table name
function getModel(table: string): ModelStatic<Model> {
  const model = sequelize.models[table];
  if (!model) {
    throw new Failure(400, "Table doesn't exist", { "table": "Table doesn't exist" });
  }
  return model;
}

async function updateMany(model: ModelStatic<Model<any, any>>, data: any) {
  for (const line of data) {
    const user = await model.findOne({ where: line.where });
    if (user) {
      console.log(user)
      await user.update(line.update);
      console.log(line.update)
      console.log("after")
      console.log(user)
    }
  }
}

async function deleteMany(model: ModelStatic<Model<any, any>>, data: any) {
  for (const line of data) {
    const user = await model.findOne({ where: line.where });
    if (user) {
      await user.destroy();
    }
  }
}

function csvToJson<T extends Record<string, any>>(csv: string, delimiter: string = ';'): T[] {
  // Split the input by new lines to separate the rows
  const rows = csv.trim().split('\n');

  // Use the first row as the header
  const headers = rows[0].split(delimiter);

  // Map each subsequent row into an object
  const json: T[] = rows.slice(1).map(row => {
    const values = row.split(delimiter);
    return headers.reduce((acc, header, index) => {
      const value = values[index];
      (acc as Record<string, any>)[header] = value;
      return acc;
    }, {} as T);
  });

  return json;
}

// Upload a file
export async function writeFromFile(type: queryString, file: Express.Multer.File | undefined) {
  if (!file) {
    throw new Failure(400, 'No file uploaded', { "file": "No file uploaded" });
  }
  const fileString = fs.readFileSync(file.path, 'utf-8');
  var jsonData = csvToJson(fileString);
  const table = "User";
  const model = getModel(table);
  switch (type) {
    case 'insert': {
      await model.bulkCreate(jsonData);
      logger.info(`Inserted data into ${table}`);
      break;
    }

    case 'update': {
      jsonData = jsonData.map(item => ({
        where: { id: item.id },
        update: { email: item.email, pass: item.pass },
      }));
      await updateMany(model, jsonData)
      logger.info(`Updated data in ${table}`);
      break;
    }

    case 'delete': {
      jsonData = jsonData.map(item => ({
        where: { id: item.id }
      }));
      await deleteMany(model, jsonData)
      logger.info(`Deleted data from ${table}`);
      break;
    }

    default:
      throw new Failure(400, "Query type doesn't exist", { "type": "Query type doesn't exist" });
  }
  console.log(jsonData);
  return
}