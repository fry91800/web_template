import express, { Router, Request, Response } from 'express';
import sequelize from '../database/database';
import { Database, DatabaseConfig, TableInfo } from '../interfaces/database.interface';  // Import the interfaces
import logger from '../config/logger';
import * as databaseUtils from '../utils/database'
import { Sequelize, Model, ModelStatic } from 'sequelize';
import { Failure } from '../types/failure'
import fs from 'fs';


export async function getDatabaseInfo() {
  // Step 1: Get each table information
  const tables: TableInfo[] = await databaseUtils.getTablesInfo();
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

export async function getTableInfo(tableName: string) {
  const tableInfo: TableInfo = await databaseUtils.getTableInfo(tableName);
  return tableInfo;
}

export async function insert(query: Query): Promise<any> {
  const { data, table } = query;
  const model = getModel(table);
  const response = await model.create(data);
  logger.info(`Inserted data into ${table}`);
  return response.dataValues;
}
export async function insertMany(query: Query): Promise<any> {
  const { data, table } = query;
  const model = getModel(table);
    logger.info(`Inserted data into ${table}`);
    //console.log(inserted)
    const res = []
    for (const object of data)
    {
     try{
      const newRecord = await model.create(object)
      res.push(newRecord.dataValues)
     }
     catch{}
    }
    console.log(res)
    return res;
  }
export async function update(query: Query): Promise<any> {
  const { data, table } = query;
  const model = getModel(table);
  console.log(JSON.stringify(query.data))
  const record = await model.findOne({ where: data.where });
  if (!record) {
    throw new Failure(400, "Record does not exist", { "record": "Record does not exist" });
  }
  await record.update(data.update);
  logger.info(`Updated data in ${table}`);
  return record.dataValues;
}
export async function remove(query: Query): Promise<any> {
  const { data, table } = query;
  const model = getModel(table);
  console.log(JSON.stringify(query.data))
  const record = await model.findOne({ where: data.where });
  if (!record) {
    throw new Failure(400, "Record does not exist", { "record": "Record does not exist" });
  }
  await record.destroy();
  logger.info(`Deleted data from ${table}`);
  return record.dataValues;
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
      await user.update(line.update);
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

export function fileToQueryData(type: queryString, file: Express.Multer.File | undefined) {
  if (!file) {
    throw new Failure(400, 'No file uploaded', { "file": "No file uploaded" });
  }
  const fileString = fs.readFileSync(file.path, 'utf-8');
  var jsonData = csvToJson(fileString);
  switch (type) {
    case 'insert': {
      logger.info("File To Query Data: Insert query type: data already formatted");
      break;
    }

    case 'update': {
      jsonData = jsonData.map(item => ({
        where: { id: item.id },
        update: { email: item.email, pass: item.pass },
      }));
      logger.info("File To Query Data: Converted file input into update query");
      break;
    }

    case 'delete': {
      jsonData = jsonData.map(item => ({
        where: { id: item.id }
      }));
      logger.info("File To Query Data: Converted file input into delete query");
      break;
    }

    default:
      throw new Failure(400, "Query type doesn't exist", { "type": "Query type doesn't exist" });
  }
  return jsonData
}